import { spawn } from 'node:child_process';
import { logger } from '../../../utils/logger.js';

/**
 * Admin command runner (testing tool).
 *
 * - Allowlisted commands always work. They run WITHOUT a shell (argv array), so nothing in them can be
 *   injected from the request.
 * - Free-form commands run through `/bin/sh -c` and are ONLY available when the server is started with
 *   ADMIN_SHELL_ENABLED=true (off by default). This is remote code execution for whoever holds an admin
 *   session, so keep it off in production unless you are actively testing.
 * - Every run is audit-logged, has a timeout and an output cap, and only one command runs at a time.
 */

const MAX_OUTPUT_BYTES = 200 * 1024;
const DEFAULT_TIMEOUT_MS = 30_000;
const MAX_TIMEOUT_MS = 120_000;
const MAX_COMMAND_LENGTH = 2000;

export interface AllowedCommand {
  id: string;
  label: string;
  description: string;
  argv: string[];
}

const port = process.env.PORT || '3000';

/** Add more read-only helpers here. Each one is an argv array (no shell). */
export const ALLOWED_COMMANDS: AllowedCommand[] = [
  { id: 'health', label: 'API health', description: 'GET /health on this server', argv: ['curl', '-s', '-m', '5', `http://127.0.0.1:${port}/health`] },
  { id: 'node-version', label: 'Node version', description: 'node -v', argv: ['node', '-v'] },
  { id: 'uptime', label: 'Uptime & load', description: 'uptime', argv: ['uptime'] },
  { id: 'disk', label: 'Disk usage', description: 'df -h', argv: ['df', '-h'] },
  { id: 'memory', label: 'Memory (Linux)', description: 'free -m', argv: ['free', '-m'] },
  { id: 'pm2-status', label: 'PM2 status', description: 'pm2 status', argv: ['pm2', 'status', '--no-color'] },
  { id: 'pm2-logs', label: 'PM2 logs (last 100 lines)', description: 'pm2 logs --nostream', argv: ['pm2', 'logs', '--nostream', '--lines', '100', '--no-color'] },
  { id: 'git-log', label: 'Last 10 commits', description: 'git log -n 10 --oneline', argv: ['git', 'log', '-n', '10', '--oneline'] },
  { id: 'migrations', label: 'Migration files', description: 'ls src/db/migrations', argv: ['ls', 'src/db/migrations'] },
  { id: 'redis-ping', label: 'Redis ping', description: 'redis-cli ping', argv: ['redis-cli', 'ping'] },
];

export interface RunResult {
  command: string;
  mode: 'allowlist' | 'free-form';
  exitCode: number | null;
  signal: string | null;
  timedOut: boolean;
  truncated: boolean;
  durationMs: number;
  stdout: string;
  stderr: string;
}

export interface RunActor {
  id: string;
  email?: string | null;
}

export function isFreeFormEnabled(): boolean {
  return process.env.ADMIN_SHELL_ENABLED === 'true';
}

// Minimal environment: the child does not inherit the API's secrets (DB URL, auth secret, ...).
function childEnv(): NodeJS.ProcessEnv {
  return {
    PATH: process.env.PATH,
    HOME: process.env.HOME,
    LANG: process.env.LANG || 'en_US.UTF-8',
    NODE_ENV: process.env.NODE_ENV,
    TERM: 'dumb',
  };
}

let busy = false;

export class AdminTerminalService {
  public listCommands() {
    return {
      freeFormEnabled: isFreeFormEnabled(),
      commands: ALLOWED_COMMANDS.map(({ id, label, description }) => ({ id, label, description })),
    };
  }

  public async runAllowed(commandId: string, actor: RunActor): Promise<RunResult> {
    const cmd = ALLOWED_COMMANDS.find((c) => c.id === commandId);
    if (!cmd) throw new Error('Unknown command id');
    return this.execute(cmd.argv[0], cmd.argv.slice(1), cmd.argv.join(' '), 'allowlist', DEFAULT_TIMEOUT_MS, actor);
  }

  public async runFreeForm(command: string, timeoutSeconds: number | undefined, actor: RunActor): Promise<RunResult> {
    if (!isFreeFormEnabled()) {
      throw new Error('Free-form commands are disabled. Set ADMIN_SHELL_ENABLED=true on the server to enable them.');
    }
    const trimmed = command.trim();
    if (!trimmed) throw new Error('Command is empty');
    if (trimmed.length > MAX_COMMAND_LENGTH) throw new Error(`Command is too long (max ${MAX_COMMAND_LENGTH} characters)`);

    const timeoutMs = Math.min(Math.max((timeoutSeconds ?? DEFAULT_TIMEOUT_MS / 1000) * 1000, 1000), MAX_TIMEOUT_MS);
    return this.execute('/bin/sh', ['-c', trimmed], trimmed, 'free-form', timeoutMs, actor);
  }

  private execute(
    file: string,
    args: string[],
    display: string,
    mode: RunResult['mode'],
    timeoutMs: number,
    actor: RunActor
  ): Promise<RunResult> {
    if (busy) {
      return Promise.reject(new Error('Another command is still running. Wait for it to finish.'));
    }
    busy = true;

    const startedAt = Date.now();
    logger.warn(`[AdminTerminal] START mode=${mode} user=${actor.id} (${actor.email ?? 'n/a'}) cmd=${JSON.stringify(display)}`);

    return new Promise<RunResult>((resolve) => {
      let stdout = '';
      let stderr = '';
      let bytes = 0;
      let truncated = false;
      let timedOut = false;
      let finished = false;

      // detached => own process group, so the whole tree can be killed on timeout/overflow
      const child = spawn(file, args, {
        cwd: process.cwd(),
        env: childEnv(),
        detached: true,
        stdio: ['ignore', 'pipe', 'pipe'],
      });

      const killTree = () => {
        try {
          if (child.pid) process.kill(-child.pid, 'SIGKILL');
        } catch {
          try { child.kill('SIGKILL'); } catch { /* already gone */ }
        }
      };

      const timer = setTimeout(() => {
        timedOut = true;
        killTree();
      }, timeoutMs);

      const collect = (which: 'out' | 'err') => (chunk: Buffer) => {
        if (truncated) return;
        const remaining = MAX_OUTPUT_BYTES - bytes;
        const text = chunk.subarray(0, Math.max(remaining, 0)).toString('utf8');
        bytes += chunk.length;
        if (which === 'out') stdout += text; else stderr += text;
        if (bytes >= MAX_OUTPUT_BYTES) {
          truncated = true;
          killTree();
        }
      };
      child.stdout.on('data', collect('out'));
      child.stderr.on('data', collect('err'));

      const done = (exitCode: number | null, signal: string | null, spawnError?: string) => {
        if (finished) return;
        finished = true;
        clearTimeout(timer);
        busy = false;
        const durationMs = Date.now() - startedAt;
        if (spawnError) stderr += (stderr ? '\n' : '') + spawnError;
        logger.warn(`[AdminTerminal] END user=${actor.id} exit=${exitCode} signal=${signal ?? ''} timedOut=${timedOut} truncated=${truncated} durationMs=${durationMs}`);
        resolve({ command: display, mode, exitCode, signal, timedOut, truncated, durationMs, stdout, stderr });
      };

      child.on('error', (err) => done(null, null, `Failed to start: ${err.message}`));
      child.on('close', (code, signal) => done(code, signal));
    });
  }
}
