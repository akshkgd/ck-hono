import type { MiddlewareHandler } from 'hono';
import { auth } from '../lib/auth.js';

export const authMiddleware = (): MiddlewareHandler => {
  return async (c, next) => {
    try {
      const sessionData = await auth.api.getSession({
        headers: c.req.raw.headers,
      });

      if (!sessionData || !sessionData.user) {
        return c.json({ status: 'error', message: 'Unauthorized: Session missing or expired' }, 401);
      }

      c.set('user', sessionData.user);
      c.set('session', sessionData.session);
      return await next();
    } catch (err: any) {
      return c.json({ status: 'error', message: 'Unauthorized: Invalid authentication session' }, 401);
    }
  };
};
