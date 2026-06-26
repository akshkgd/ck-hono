import { Hono } from 'hono';
import { AdminEnrollmentsController } from './admin-enrollments.controller.js';
import { authMiddleware } from '../../../middleware/auth.middleware.js';
import { adminMiddleware } from '../../../middleware/admin.middleware.js';
import { zValidator } from '@hono/zod-validator';
import { createEnrollmentSchema, updateEnrollmentSchema } from '../../enrollments/enrollment.validation.js';

const adminEnrollmentsRouter = new Hono();
const controller = new AdminEnrollmentsController();

// Require authentication and admin role for all enrollment administrative actions
adminEnrollmentsRouter.use('*', authMiddleware(), adminMiddleware());

adminEnrollmentsRouter.get('/', controller.search);
adminEnrollmentsRouter.get('/:id', controller.get);
adminEnrollmentsRouter.post('/', zValidator('json', createEnrollmentSchema), controller.create);
adminEnrollmentsRouter.put('/:id', zValidator('json', updateEnrollmentSchema), controller.edit);
adminEnrollmentsRouter.delete('/:id', controller.delete);

export default adminEnrollmentsRouter;
