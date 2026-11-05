import type { Context } from 'hono';
import { z } from 'zod';
import { AdminTerminalService } from './admin-terminal.service.js';

const runSchema = z.object({
  commandId: z.string().min(1).optional(),
  command: z.string().optional(),
  timeoutSeconds: z.number().int().min(1).max(120).optional(),
}).refine((v) => !!v.commandId !== !!v.command, {
  message: 'Send exactly one of "commandId" (allowlist) or "command" (free-form)',
});

export class AdminTerminalController {
  private service = new AdminTerminalService();

  public listCommands = async (c: Context) => {
    return c.json({ status: 'success', data: this.service.listCommands() }, 200);
  };

  public run = async (c: Context) => {
    try {
      const user = c.get('user');
      const raw = await c.req.json().catch(() => ({}));
      const parsed = runSchema.safeParse(raw);
      if (!parsed.success) {
        return c.json({ status: 'error', message: parsed.error.issues.map((i) => i.message).join(', ') }, 400);
      }

      const actor = { id: user.id, email: user.email };
      const result = parsed.data.commandId
        ? await this.service.runAllowed(parsed.data.commandId, actor)
        : await this.service.runFreeForm(parsed.data.command as string, parsed.data.timeoutSeconds, actor);

      return c.json({ status: 'success', data: result }, 200);
    } catch (err: any) {
      const message = err.message || 'Failed to run command';
      const status = message.includes('still running') ? 409 : message.includes('disabled') ? 403 : 400;
      return c.json({ status: 'error', message }, status);
    }
  };
}
