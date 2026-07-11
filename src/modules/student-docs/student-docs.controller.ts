import type { Context } from 'hono';
import { getStudentDocsHtml } from './student-docs.view.js';

export class StudentDocsController {
  public serve = (c: Context) => {
    const html = getStudentDocsHtml();
    return c.html(html);
  };
}
