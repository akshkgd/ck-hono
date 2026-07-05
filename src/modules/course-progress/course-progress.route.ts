import { Hono } from 'hono';
import { CourseProgressController } from './course-progress.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { zValidator } from '@hono/zod-validator';
import { upsertProgressSchema } from './course-progress.validation.js';

const courseProgressRouter = new Hono();
const controller = new CourseProgressController();

// Require authenticated user for all endpoints
courseProgressRouter.use('*', authMiddleware());

courseProgressRouter.post('/', zValidator('json', upsertProgressSchema), controller.upsertProgress);
courseProgressRouter.get('/batch/:batchId', controller.getBatchProgress);

export default courseProgressRouter;
