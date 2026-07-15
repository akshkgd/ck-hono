import { Hono } from 'hono';
import { AdminAssignmentsController } from './admin-assignments.controller.js';
import { adminMiddleware } from '../../../middleware/admin.middleware.js';
import { authMiddleware } from '../../../middleware/auth.middleware.js';
import { zValidator } from '@hono/zod-validator';
import { assignmentsQuerySchema, gradeAssignmentSchema, enrollmentAssignmentsParamsSchema } from './admin-assignments.validation.js';

const adminAssignmentsRouter = new Hono();
const controller = new AdminAssignmentsController();

// Protect all routes with auth and admin access controls
adminAssignmentsRouter.use('*', authMiddleware());
adminAssignmentsRouter.use('*', adminMiddleware());

adminAssignmentsRouter.get(
  '/',
  zValidator('query', assignmentsQuerySchema),
  controller.getAssignments
);

adminAssignmentsRouter.get(
  '/enrollments/:enrollmentId',
  zValidator('param', enrollmentAssignmentsParamsSchema),
  controller.getEnrollmentAssignments
);

adminAssignmentsRouter.post(
  '/:progressId/grade',
  zValidator('json', gradeAssignmentSchema),
  controller.gradeSubmission
);

export default adminAssignmentsRouter;
