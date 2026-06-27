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
    const meta = {
      requestId,
      method,
      path,
      status,
      durationMs: duration,
    };

    if (status >= 500) {
      logger.error(message, meta);
    } else if (status >= 400) {
      logger.warn(message, meta);
    } else {
      logger.info(message, meta);
    }
  };
};
