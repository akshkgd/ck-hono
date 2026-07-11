import { Hono } from 'hono';
import { StudentDocsController } from './student-docs.controller.js';

const studentDocsRouter = new Hono();
const controller = new StudentDocsController();

studentDocsRouter.get('/', controller.serve);

export default studentDocsRouter;
