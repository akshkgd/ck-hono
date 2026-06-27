import type { MiddlewareHandler } from 'hono';
import { logger } from '../utils/logger.js';

export const loggerMiddleware = (): MiddlewareHandler => {
  return async (c, next) => {
    const { method, path } = c.req;
    const start = Date.now();
    const requestId = c.get('requestId') || 'unknown';

    await next();

    const duration = Date.now() - start;
    const status = c.res.status;

    const message = `${method} ${path} ${status} - ${duration}ms`;
    
    let responseBody: any = undefined;
    const contentType = c.res.headers.get('content-type') || '';
    
    // Only capture JSON responses to avoid logging HTML page markups
    if (contentType.includes('application/json')) {
      try {
        const clone = c.res.clone();
        const text = await clone.text();
        responseBody = JSON.parse(text);
      } catch {
        // Ignore parsing exceptions
      }
    }

    const meta: any = {
      requestId,
      method,
      path,
      status,
      durationMs: duration,
    };

    if (responseBody) {
      meta.responseBody = responseBody;
    }

    if (status >= 500) {
      logger.error(message, meta);
    } else if (status >= 400) {
      logger.warn(message, meta);
    } else {
      logger.info(message, meta);
    }
  };
};
