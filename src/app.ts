import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { compress } from 'hono/compress';
import { requestId } from 'hono/request-id';
import systemRouter from './modules/system/system.route.js';

const app = new Hono();

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

// Routes
app.route('/', systemRouter);

export default app;
