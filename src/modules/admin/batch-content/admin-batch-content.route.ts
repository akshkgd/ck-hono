import { Hono } from 'hono';
import { AdminBatchContentController } from './admin-batch-content.controller.js';
import { authMiddleware } from '../../../middleware/auth.middleware.js';
import { adminMiddleware } from '../../../middleware/admin.middleware.js';
import { zValidator } from '@hono/zod-validator';
import { createBatchContentSchema, updateBatchContentSchema, createBulkBatchContentSchema } from '../../batch-content/batch-content.validation.js';

const adminBatchContentRouter = new Hono();
const controller = new AdminBatchContentController();

// Require authenticated user with "admin" role for all endpoints
adminBatchContentRouter.use('*', authMiddleware(), adminMiddleware());

adminBatchContentRouter.get('/', controller.search);
adminBatchContentRouter.get('/:id', controller.get);
adminBatchContentRouter.post('/', zValidator('json', createBatchContentSchema), controller.create);
adminBatchContentRouter.post('/bulk', zValidator('json', createBulkBatchContentSchema), controller.createBulk);
adminBatchContentRouter.put('/reorder', controller.reorder);
adminBatchContentRouter.put('/:id', zValidator('json', updateBatchContentSchema), controller.edit);
adminBatchContentRouter.delete('/:id', controller.delete);

export default adminBatchContentRouter;
