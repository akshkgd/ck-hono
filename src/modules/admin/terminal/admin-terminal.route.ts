import { Hono } from 'hono';
import { AdminTerminalController } from './admin-terminal.controller.js';
import { authMiddleware } from '../../../middleware/auth.middleware.js';
import { adminMiddleware } from '../../../middleware/admin.middleware.js';

const adminTerminalRouter = new Hono();
const controller = new AdminTerminalController();

// Authenticated admins only
adminTerminalRouter.use('*', authMiddleware());
adminTerminalRouter.use('*', adminMiddleware());

adminTerminalRouter.get('/commands', controller.listCommands);
adminTerminalRouter.post('/run', controller.run);

export default adminTerminalRouter;
