import { describe, expect, it } from 'vitest';
import { Hono } from 'hono';
import docsV2Router from './docs-v2.route.js';
import { PAGES } from './pages/index.js';
import { fullPath } from './kit.js';

const app = new Hono();
app.route('/docs/v2', docsV2Router);

const urlOf = (path: string) => (path ? `/docs/v2/${path}` : '/docs/v2');

describe('docs v2', () => {
  it('has unique page paths', () => {
    const paths = PAGES.map((p) => p.path);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it('has unique endpoint ids per page and unique method+path overall', () => {
    const seen = new Set<string>();
    for (const page of PAGES) {
      const ids = new Set<string>();
      for (const item of page.items) {
        const id = item.kind === 'endpoint' ? item.ep.id : item.kind === 'section' ? item.id : null;
        if (!id) continue;
        expect(ids.has(id), `${page.path}: duplicate id ${id}`).toBe(false);
        ids.add(id);
        if (item.kind === 'endpoint') {
          const key = `${item.ep.method} ${fullPath(item.ep)}`;
          expect(seen.has(key), `duplicate endpoint ${key}`).toBe(false);
          seen.add(key);
        }
      }
    }
  });

  it('renders every page with 200 and resolves internal links and anchors', async () => {
    const html = new Map<string, string>();
    for (const page of PAGES) {
      const res = await app.request(urlOf(page.path));
      expect(res.status, page.path).toBe(200);
      html.set(urlOf(page.path), await res.text());
    }

    for (const [url, body] of html) {
      const ids = [...body.matchAll(/ id="([^"]+)"/g)].map((m) => m[1]);
      expect(new Set(ids).size, `${url}: duplicate element ids`).toBe(ids.length);

      for (const m of body.matchAll(/href="(\/docs\/v2[^"#]*)(#[^"]*)?"/g)) {
        const target = html.get(m[1]);
        expect(target, `${url}: broken link ${m[1]}`).toBeDefined();
        if (m[2]) expect(target!.includes(` id="${m[2].slice(1)}"`), `${url}: broken anchor ${m[1]}${m[2]}`).toBe(true);
      }
    }
  });

  it('redirects trailing slashes', async () => {
    const res = await app.request('/docs/v2/admin/users/');
    expect(res.status).toBe(301);
    expect(res.headers.get('location')).toBe('/docs/v2/admin/users');
  });
});
