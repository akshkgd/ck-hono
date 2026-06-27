import { Hono } from 'hono';
import { AdminContentLibraryController } from './admin-content-library.controller.js';
import { authMiddleware } from '../../../middleware/auth.middleware.js';
import { adminMiddleware } from '../../../middleware/admin.middleware.js';
import { zValidator } from '@hono/zod-validator';
import { createContentLibrarySchema, updateContentLibrarySchema } from '../../content-library/content-library.validation.js';

const adminContentLibraryRouter = new Hono();
const controller = new AdminContentLibraryController();

// Require authenticated user with "admin" role for all endpoints
adminContentLibraryRouter.use('*', authMiddleware(), adminMiddleware());

adminContentLibraryRouter.get('/', controller.search);
adminContentLibraryRouter.get('/:id', controller.get);
adminContentLibraryRouter.post('/', zValidator('json', createContentLibrarySchema), controller.create);
adminContentLibraryRouter.put('/:id', zValidator('json', updateContentLibrarySchema), controller.edit);
adminContentLibraryRouter.delete('/:id', controller.delete);

export default adminContentLibraryRouter;
