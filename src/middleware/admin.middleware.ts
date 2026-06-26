import type { MiddlewareHandler } from 'hono';

export const adminMiddleware = (): MiddlewareHandler => {
  return async (c, next) => {
    const user = c.get('user');
    if (!user) {
      return c.json({ status: 'error', message: 'Unauthorized: Authentication required' }, 401);
    }

    if (user.role !== 'admin') {
      return c.json({ status: 'error', message: 'Forbidden: Admin access required' }, 403);
    }

    await next();
  };
};
