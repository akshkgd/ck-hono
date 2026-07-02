import { Hono } from 'hono';
import { ReportsController } from './reports.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { adminMiddleware } from '../../middleware/admin.middleware.js';

const reportsRouter = new Hono();
const controller = new ReportsController();

// Ensure all reports endpoints require authentication and admin privileges
reportsRouter.use('*', authMiddleware(), adminMiddleware());

reportsRouter.get('/summary', controller.getSummary);

export default reportsRouter;
