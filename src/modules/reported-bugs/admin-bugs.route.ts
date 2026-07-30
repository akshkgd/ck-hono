import { Hono } from 'hono';
import { AdminBugsController } from './admin-bugs.controller.js';
import { zValidator } from '@hono/zod-validator';
import { updateBugSchema, bugSearchQuerySchema } from './reported-bugs.validation.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { adminMiddleware } from '../../middleware/admin.middleware.js';

const adminBugsRouter = new Hono();
const controller = new AdminBugsController();

adminBugsRouter.use('*', authMiddleware(), adminMiddleware());

adminBugsRouter.get('/', zValidator('query', bugSearchQuerySchema), controller.search);
adminBugsRouter.get('/:id', controller.get);
adminBugsRouter.put('/:id', zValidator('json', updateBugSchema), controller.update);
adminBugsRouter.delete('/:id', controller.delete);

export default adminBugsRouter;
