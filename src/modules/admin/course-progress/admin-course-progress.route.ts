import { Hono } from 'hono';
import { AdminCourseProgressController } from './admin-course-progress.controller.js';
import { adminMiddleware } from '../../../middleware/admin.middleware.js';
import { authMiddleware } from '../../../middleware/auth.middleware.js';
import { zValidator } from '@hono/zod-validator';
import {
  progressQuerySchema,
  enrollmentProgressParamsSchema,
  resetAssignmentsSchema,
  bulkUpdateProgressSchema
} from './admin-course-progress.validation.js';

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

adminProgressRouter.post(
  '/assignments/reset-submitted',
  zValidator('json', resetAssignmentsSchema),
  controller.resetSubmittedAssignments
);

adminProgressRouter.post(
  '/bulk-update',
  zValidator('json', bulkUpdateProgressSchema),
  controller.bulkUpdateProgress
);

// One-off repair of enrollment totals (dry run unless the body sets "dryRun": false)
adminProgressRouter.post(
  '/recalculate-aggregates',
  controller.recalculateAggregates
);

export default adminProgressRouter;
