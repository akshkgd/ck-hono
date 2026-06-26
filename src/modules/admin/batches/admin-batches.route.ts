import { Hono } from 'hono';
import { AdminBatchesController } from './admin-batches.controller.js';
import { authMiddleware } from '../../../middleware/auth.middleware.js';
import { adminMiddleware } from '../../../middleware/admin.middleware.js';
import { zValidator } from '@hono/zod-validator';
import { createBatchSchema, updateBatchSchema } from '../../batches/batch.validation.js';

const adminBatchesRouter = new Hono();
const controller = new AdminBatchesController();

// Require authenticated user with "admin" role for all endpoints
adminBatchesRouter.use('*', authMiddleware(), adminMiddleware());

adminBatchesRouter.get('/', controller.search);
adminBatchesRouter.get('/:id', controller.get);
adminBatchesRouter.post('/', zValidator('json', createBatchSchema), controller.create);
adminBatchesRouter.put('/:id', zValidator('json', updateBatchSchema), controller.edit);
adminBatchesRouter.delete('/:id', controller.delete);

export default adminBatchesRouter;
