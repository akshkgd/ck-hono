import { Hono } from 'hono';
import { AdminLogsController } from './admin-logs.controller.js';
import { authMiddleware } from '../../../middleware/auth.middleware.js';
import { adminMiddleware } from '../../../middleware/admin.middleware.js';

const adminLogsRouter = new Hono();
const controller = new AdminLogsController();

// Ensure all log API endpoints require admin authentication
adminLogsRouter.use('*', authMiddleware(), adminMiddleware());

adminLogsRouter.get('/files', controller.listFiles);
adminLogsRouter.get('/data', controller.getLogData);
adminLogsRouter.delete('/:file', controller.deleteFile);
adminLogsRouter.delete('/:file/clear', controller.clearFile);
adminLogsRouter.get('/:file/download', controller.downloadFile);

export default adminLogsRouter;
