import type { Context } from 'hono';
import { getDocsHtml } from './playground.view.js';

export class PlaygroundController {
  public serve = (c: Context) => {
    const html = getDocsHtml();
    return c.html(html);
  };
}
