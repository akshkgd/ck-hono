import { Hono } from 'hono';
import { AdminController } from './admin.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { adminMiddleware } from '../../middleware/admin.middleware.js';

const adminRouter = new Hono();
const controller = new AdminController();

// Ensure all admin endpoints require authentication and admin privileges
adminRouter.use('*', authMiddleware(), adminMiddleware());

adminRouter.get('/', controller.search);
adminRouter.post('/', controller.add);
adminRouter.put('/:id', controller.edit);
adminRouter.delete('/:id', controller.delete);
adminRouter.patch('/:id/role', controller.changeRole);
adminRouter.patch('/:id/status', controller.changeStatus);
adminRouter.get('/:id/details', controller.getDetails);

export default adminRouter;
