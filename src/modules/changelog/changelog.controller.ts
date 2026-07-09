import type { Context } from 'hono';
import { getChangelogHtml } from './changelog.view.js';

export class ChangelogController {
  public serve = (c: Context) => {
    const html = getChangelogHtml();
    return c.html(html);
  };
}
