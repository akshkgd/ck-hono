import type { Context } from 'hono';
import { getDocsHtml } from './docs.view.js';

export class DocsController {
  public serve = (c: Context) => {
    const html = getDocsHtml();
    return c.html(html);
  };
}
