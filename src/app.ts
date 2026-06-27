import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { compress } from 'hono/compress';
import { requestId } from 'hono/request-id';

import systemRouter from './modules/system/system.route.js';
import authRouter from './modules/auth/auth.route.js';
import adminRouter from './modules/admin/admin.route.js';
import adminBatchesRouter from './modules/admin/batches/admin-batches.route.js';
import adminEnrollmentsRouter from './modules/admin/enrollments/admin-enrollments.route.js';
import adminPaymentsRouter from './modules/admin/payments/admin-payments.route.js';
import adminBatchSectionsRouter from './modules/admin/batch-sections/admin-batch-sections.route.js';
import adminContentLibraryRouter from './modules/admin/content-library/admin-content-library.route.js';
import docsRouter from './modules/docs/docs.route.js';
import { activityMiddleware } from './middleware/activity.middleware.js';

export type AppEnv = {
  Variables: {
    user: any;
  };
};

const app = new Hono<AppEnv>();

// Request ID for tracing
app.use('*', requestId());

// Global Middleware
app.use('*', logger());
app.use('*', cors());
app.use('*', secureHeaders());
app.use('*', compress());

// Global Error Handler
app.onError((err, c) => {
  const reqId = c.get('requestId');
  console.error(`[Error] Request ID: ${reqId} - ${err.message}`, err.stack);
  
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

// Register Routes
app.route('/v1', v1);
app.route('/docs', docsRouter);

// Global 404 Handler
app.notFound((c) => {
  return c.json({
    status: 'error',
    message: 'Route not found',
  }, 404);
});

export default app;
