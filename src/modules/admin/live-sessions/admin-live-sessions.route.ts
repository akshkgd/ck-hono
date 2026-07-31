import { Hono } from 'hono';
import { AdminLiveSessionsController } from './admin-live-sessions.controller.js';
import { adminMiddleware } from '../../../middleware/admin.middleware.js';
import { authMiddleware } from '../../../middleware/auth.middleware.js';
import { zValidator } from '@hono/zod-validator';
import {
  createLiveSessionSchema,
  updateLiveSessionSchema,
  queryLiveSessionSchema,
  recordAttendanceSchema
} from './admin-live-sessions.validation.js';

const adminLiveSessionsRouter = new Hono();
const controller = new AdminLiveSessionsController();

// Require admin authentication
adminLiveSessionsRouter.use('*', authMiddleware());
adminLiveSessionsRouter.use('*', adminMiddleware());

adminLiveSessionsRouter.post(
  '/live-sessions/attendance',
  zValidator('json', recordAttendanceSchema),
  controller.recordAttendance
);

adminLiveSessionsRouter.get(
  '/batches/:batchId/live-sessions',
  zValidator('query', queryLiveSessionSchema),
  controller.list
);

adminLiveSessionsRouter.post(
  '/batches/:batchId/live-sessions',
  zValidator('json', createLiveSessionSchema),
  controller.create
);

adminLiveSessionsRouter.get(
  '/live-sessions/:id',
  controller.getDetails
);

adminLiveSessionsRouter.patch(
  '/live-sessions/:id',
  zValidator('json', updateLiveSessionSchema),
  controller.update
);

adminLiveSessionsRouter.delete(
  '/live-sessions/:id',
  controller.delete
);

export default adminLiveSessionsRouter;
