import { Hono } from 'hono';
import { StudentLiveSessionsController } from './student-live-sessions.controller.js';
import { authMiddleware } from '../../../middleware/auth.middleware.js';

const studentLiveSessionsRouter = new Hono();
const controller = new StudentLiveSessionsController();

studentLiveSessionsRouter.get(
  '/batches/:batchId/live-sessions',
  authMiddleware(),
  controller.list
);

export default studentLiveSessionsRouter;
