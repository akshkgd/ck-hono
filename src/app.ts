import 'dotenv/config';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import { compress } from 'hono/compress';
import { requestId } from 'hono/request-id';
import { loggerMiddleware } from './middleware/logger.middleware.js';
import { logger } from './utils/logger.js';

import systemRouter from './modules/system/system.route.js';
import authRouter from './modules/auth/auth.route.js';
import adminRouter from './modules/admin/admin.route.js';
import adminBatchesRouter from './modules/admin/batches/admin-batches.route.js';
import adminEnrollmentsRouter from './modules/admin/enrollments/admin-enrollments.route.js';
import adminPaymentsRouter from './modules/admin/payments/admin-payments.route.js';
import adminBatchSectionsRouter from './modules/admin/batch-sections/admin-batch-sections.route.js';
import adminContentLibraryRouter from './modules/admin/content-library/admin-content-library.route.js';
import adminReportsRouter from './modules/reports/reports.route.js';
import adminAnalyticsRouter from './modules/admin/analytics/analytics.route.js';
import adminBatchContentRouter from './modules/admin/batch-content/admin-batch-content.route.js';
import adminLogsRouter from './modules/admin/logs/admin-logs.route.js';
import docsRouter from './modules/docs/docs.route.js';
import changelogRouter from './modules/changelog/changelog.route.js';
import playgroundRouter from './modules/playground/playground.route.js';
import courseProgressRouter from './modules/course-progress/course-progress.route.js';
import { activityMiddleware } from './middleware/activity.middleware.js';
import { authMiddleware } from './middleware/auth.middleware.js';
import { adminMiddleware } from './middleware/admin.middleware.js';
import { renderLogsView } from './modules/admin/logs/logs.view.js';

export type AppEnv = {
  Variables: {
    user: any;
  };
};

const app = new Hono<AppEnv>();

// Request ID for tracing
app.use('*', requestId());

// Global Middleware
app.use('*', loggerMiddleware());
app.use('*', cors());
app.use('*', secureHeaders());
app.use('*', compress());

// Global Error Handler
app.onError((err, c) => {
  const reqId = c.get('requestId');
  logger.error(`Request ID: ${reqId} - ${err.message}`, {
    requestId: reqId,
    stack: err.stack,
  });
  
  return c.json({ 
    status: 'error', 
    message: 'Internal Server Error',
    requestId: reqId
  }, 500);
});

// V1 API Sub-router
const v1 = new Hono<AppEnv>();
v1.use('*', activityMiddleware());
v1.route('/', systemRouter);
v1.route('/auth', authRouter);
v1.route('/admin/users', adminRouter);
v1.route('/admin/batches', adminBatchesRouter);
v1.route('/admin/enrollments', adminEnrollmentsRouter);
v1.route('/admin/enrollment-payments', adminPaymentsRouter);
v1.route('/admin/batch-sections', adminBatchSectionsRouter);
v1.route('/admin/content-library', adminContentLibraryRouter);
v1.route('/admin/reports', adminReportsRouter);
v1.route('/admin/analytics', adminAnalyticsRouter);
v1.route('/admin/batch-contents', adminBatchContentRouter);
v1.route('/admin/logs', adminLogsRouter);
v1.route('/course-progress', courseProgressRouter);

// Register Routes
app.route('/v1', v1);
app.route('/docs', docsRouter);
app.route('/changelog', changelogRouter);
app.route('/playground', playgroundRouter);
app.get('/admin/logs', (c) => c.html(renderLogsView()));

// Global 404 Handler
app.notFound((c) => {
  return c.json({
    status: 'error',
    message: 'Route not found',
  }, 404);
});

export default app;
