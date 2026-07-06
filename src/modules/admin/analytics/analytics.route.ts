import { Hono } from 'hono';
import { AnalyticsController } from './analytics.controller.js';
import { authMiddleware } from '../../../middleware/auth.middleware.js';
import { adminMiddleware } from '../../../middleware/admin.middleware.js';

const adminAnalyticsRouter = new Hono();
const controller = new AnalyticsController();

// Ensure all analytics endpoints require admin privileges
adminAnalyticsRouter.use('*', authMiddleware(), adminMiddleware());

adminAnalyticsRouter.get('/overview', controller.getOverview);
adminAnalyticsRouter.get('/db-stats', controller.getDbStats);

export default adminAnalyticsRouter;
