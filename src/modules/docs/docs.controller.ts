import type { Context } from 'hono';
import { getDocsHtml } from './docs.view.js';
import { getPaymentsDocsHtml } from './payments-docs.view.js';
import { getImplementDocsHtml } from './implement-docs.view.js';
import { getEmailPreviewHtml } from './email-preview.view.js';

export class DocsController {
  public serve = (c: Context) => {
    const html = getDocsHtml();
    return c.html(html);
  };

  public servePayments = (c: Context) => {
    const html = getPaymentsDocsHtml();
    return c.html(html);
  };

  public serveImplement = (c: Context) => {
    const html = getImplementDocsHtml();
    return c.html(html);
  };

  public serveEmailPreview = (c: Context) => {
    const html = getEmailPreviewHtml();
    return c.html(html);
  };
}
