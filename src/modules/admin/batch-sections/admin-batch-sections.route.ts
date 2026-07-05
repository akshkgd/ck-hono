import { Hono } from 'hono';
import { AdminBatchSectionsController } from './admin-batch-sections.controller.js';
import { authMiddleware } from '../../../middleware/auth.middleware.js';
import { adminMiddleware } from '../../../middleware/admin.middleware.js';
import { zValidator } from '@hono/zod-validator';
import { createBatchSectionSchema, updateBatchSectionSchema } from '../../batches/batch-section.validation.js';

const adminBatchSectionsRouter = new Hono();
const controller = new AdminBatchSectionsController();

// Require authenticated user with "admin" role for all endpoints
adminBatchSectionsRouter.use('*', authMiddleware(), adminMiddleware());

adminBatchSectionsRouter.get('/', controller.search);
adminBatchSectionsRouter.get('/:id', controller.get);
adminBatchSectionsRouter.post('/', zValidator('json', createBatchSectionSchema), controller.create);
adminBatchSectionsRouter.put('/reorder', controller.reorder);
adminBatchSectionsRouter.put('/:id', zValidator('json', updateBatchSectionSchema), controller.edit);
adminBatchSectionsRouter.delete('/:id', controller.delete);

export default adminBatchSectionsRouter;
