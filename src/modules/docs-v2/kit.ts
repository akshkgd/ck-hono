/**
 * Docs v2 content model + small HTML helpers.
 *
 * Every docs page is plain data (see ./pages/*.ts). The renderer in ./layout.ts turns it into HTML,
 * so adding or changing an endpoint is a data edit, not a markup edit.
 */

export type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * Who may call an endpoint.
 * - public:     no authentication
 * - optional:   works as guest, but uses the session when one is sent
 * - user:       any signed-in user (student or admin)
 * - admin:      signed-in user whose DB role is `admin`
 * - webhook:    called by a third party, verified by signature
 * - open-admin: lives under an admin-looking URL but has NO auth middleware today
 */
export type Access = 'public' | 'optional' | 'user' | 'admin' | 'webhook' | 'open-admin';

export interface Param {
  name: string;
  type: string;
  /** 'required' | 'optional' | free text such as "required when type = x" */
  req: string;
  desc: string;
}

export const p = (name: string, type: string, req: string, desc: string): Param => ({ name, type, req, desc });

export interface Endpoint {
  /** anchor id, unique per page */
  id: string;
  method: Method;
  /** path after the base prefix, e.g. `/auth/me` */
  path: string;
  /** base prefix, defaults to `/v1` */
  base?: string;
  access: Access;
  title: string;
  desc: string;
  notes?: string[];
  pathParams?: Param[];
  query?: Param[];
  body?: Param[];
  bodyExample?: unknown;
  /** extra request headers (besides auth + content-type) */
  headers?: Param[];
  response?: { status: number; example?: unknown; note?: string };
  errors?: Array<[number, string]>;
  /** response is not the usual JSON envelope (file download, HTML, ...) */
  rawResponse?: boolean;
}

export type Item =
  | { kind: 'endpoint'; ep: Endpoint }
  | { kind: 'section'; id: string; title: string; html?: string }
  | { kind: 'html'; html: string };

export interface Page {
  /** URL path under /docs/v2, no leading slash. Empty string = docs home. */
  path: string;
  title: string;
  group: string;
  summary: string;
  items: Item[];
}

export const ep = (e: Endpoint): Item => ({ kind: 'endpoint', ep: e });
export const section = (id: string, title: string, html?: string): Item => ({ kind: 'section', id, title, html });
export const html = (h: string): Item => ({ kind: 'html', html: h });

// ---------- escaping / inline formatting ----------

export function esc(s: unknown): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Escape, then allow `code` and **bold** inline formatting. */
export function md(s: string): string {
  return esc(s)
    .replace(/`([^`]+)`/g, '<code class="ic">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\((\/[^)\s]*)\)/g, '<a class="underline text-indigo-600 dark:text-indigo-300" href="$2">$1</a>');
}

export const BASE_URL = 'https://api.codekaro.in';

export function fullPath(e: Endpoint): string {
  return `${e.base ?? '/v1'}${e.path}`;
}

/** Build the JavaScript fetch snippet for an endpoint. */
export function fetchSnippet(e: Endpoint): string {
  const url = `${BASE_URL}${fullPath(e)}`;
  const hasBody = e.body && e.method !== 'GET' && e.method !== 'DELETE';
  const needsAuth = e.access === 'user' || e.access === 'admin' || e.access === 'optional';
  const lines: string[] = [];
  const query = e.query && e.query.length ? '?' + e.query.slice(0, 2).map((q) => `${q.name}=...`).join('&') : '';
  lines.push(`const res = await fetch('${url}${query}', {`);
  lines.push(`  method: '${e.method}',`);
  const headers: string[] = [];
  if (needsAuth) headers.push(`    Authorization: \`Bearer \${sessionToken}\`${e.access === 'optional' ? ' // optional' : ''},`);
  if (hasBody) headers.push(`    'Content-Type': 'application/json',`);
  for (const h of e.headers ?? []) headers.push(`    '${h.name}': '...',`);
  if (headers.length) {
    lines.push('  headers: {');
    lines.push(...headers);
    lines.push('  },');
  }
  if (needsAuth) lines.push(`  // or rely on the session cookie: credentials: 'include'`);
  if (hasBody) {
    const body = e.bodyExample !== undefined ? JSON.stringify(e.bodyExample, null, 2).split('\n').map((l, i) => (i === 0 ? l : '  ' + l)).join('\n') : '{ /* ... */ }';
    lines.push(`  body: JSON.stringify(${body}),`);
  }
  lines.push('});');
  lines.push('const json = await res.json();');
  return lines.join('\n');
}

export const ACCESS_LABEL: Record<Access, string> = {
  public: 'Public',
  optional: 'Optional auth',
  user: 'Signed-in user',
  admin: 'Admin only',
  webhook: 'Webhook',
  'open-admin': 'No auth (!)',
};

/** Common envelope example used by many pages. */
export const ok = <T>(data: T, message?: string) => ({ status: 'success', ...(message ? { message } : {}), data });

export const pagination = (page = 1, limit = 10, total = 42) => ({ page, limit, total });

export const SAMPLE = {
  uuid: '6f1c2c1e-3b0e-4d57-9a54-0d6b7f6f3a10',
  uuid2: 'b7a8d0b4-5f3b-4f58-8c3a-1c9a2f0e7d21',
  uuid3: 'e2a1c3d4-7a91-4b1e-9d52-3a5c8f1b6e02',
  iso: '2026-11-12T09:30:00.000Z',
  date: '2026-11-12',
};
