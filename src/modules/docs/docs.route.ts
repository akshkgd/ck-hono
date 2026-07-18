import { Hono } from 'hono';
import { DocsController } from './docs.controller.js';

const docsRouter = new Hono();
const controller = new DocsController();

docsRouter.get('/', controller.serve);
docsRouter.get('/payments', controller.servePayments);

export default docsRouter;
