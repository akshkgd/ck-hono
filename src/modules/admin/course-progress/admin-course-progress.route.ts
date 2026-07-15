import { Hono } from 'hono';
import { AdminCourseProgressController } from './admin-course-progress.controller.js';
import { adminMiddleware } from '../../../middleware/admin.middleware.js';
import { authMiddleware } from '../../../middleware/auth.middleware.js';
import { zValidator } from '@hono/zod-validator';
import { progressQuerySchema, enrollmentProgressParamsSchema } from './admin-course-progress.validation.js';

const adminProgressRouter = new Hono();
const controller = new AdminCourseProgressController();

// Require authenticated user and administrator access
adminProgressRouter.use('*', authMiddleware());
adminProgressRouter.use('*', adminMiddleware());

adminProgressRouter.get(
  '/',
  zValidator('query', progressQuerySchema),
  controller.getProgressLog
);

adminProgressRouter.get(
  '/enrollments/:enrollmentId',
  zValidator('param', enrollmentProgressParamsSchema),
  controller.getEnrollmentBatchProgress
);

export default adminProgressRouter;
