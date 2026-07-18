import { Hono } from 'hono';
import { AdminPaymentsController } from './admin-payments.controller.js';
import { authMiddleware } from '../../../middleware/auth.middleware.js';
import { adminMiddleware } from '../../../middleware/admin.middleware.js';
import { zValidator } from '@hono/zod-validator';
import { createPaymentSchema, updatePaymentSchema } from '../../payments/payment.validation.js';

const adminPaymentsRouter = new Hono();
const controller = new AdminPaymentsController();

// Require authentication and admin role for all payment administrative actions
adminPaymentsRouter.use('*', authMiddleware(), adminMiddleware());

adminPaymentsRouter.get('/', controller.search);
adminPaymentsRouter.get('/transactions', controller.transactions);
adminPaymentsRouter.get('/:id', controller.get);
adminPaymentsRouter.post('/', zValidator('json', createPaymentSchema), controller.create);
adminPaymentsRouter.put('/:id', zValidator('json', updatePaymentSchema), controller.edit);
adminPaymentsRouter.delete('/:id', controller.delete);

export default adminPaymentsRouter;
