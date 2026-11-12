import { Hono } from 'hono';
import { buildSearchIndex, DOCS_ROOT, renderPage } from './layout.js';
import { PAGES } from './pages/index.js';

/**
 * New structured API docs, mounted at /docs/v2. One route per page, all rendered from
 * plain data in ./pages (see ./kit.ts for the content model).
 */
const docsV2Router = new Hono();

const searchIndex = buildSearchIndex(PAGES);

for (const page of PAGES) {
  const route = page.path ? `/${page.path}` : '/';
  docsV2Router.get(route, (c) => c.html(renderPage(page, PAGES, searchIndex)));
}

// Accept a trailing slash on every page, e.g. /docs/v2/admin/users/
docsV2Router.get('/*', (c, next) => {
  const path = c.req.path;
  if (path.length > 1 && path.endsWith('/')) {
    return c.redirect(path.replace(/\/+$/, '') || DOCS_ROOT, 301);
  }
  return next();
});

export default docsV2Router;
