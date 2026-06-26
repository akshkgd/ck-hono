import { Hono } from 'hono';
import { DocsController } from './docs.controller.js';

const docsRouter = new Hono();
const controller = new DocsController();

docsRouter.get('/', controller.serve);

export default docsRouter;
