import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { PublicLiveSessionsController } from './public-live-sessions.controller.js';
import { publicLiveSessionParamSchema, publicRecordAttendanceSchema } from './public-live-sessions.validation.js';

const publicLiveSessionsRouter = new Hono();
const controller = new PublicLiveSessionsController();

publicLiveSessionsRouter.get(
  '/:id/public',
  zValidator('param', publicLiveSessionParamSchema),
  controller.getPublicDetails
);

publicLiveSessionsRouter.post(
  '/attendance/public',
  zValidator('json', publicRecordAttendanceSchema),
  controller.recordAttendance
);

export default publicLiveSessionsRouter;
