import type { MiddlewareHandler } from 'hono';
import { auth } from '../lib/auth.js';
import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export const authMiddleware = (): MiddlewareHandler => {
  return async (c, next) => {
    try {
      const sessionData = await auth.api.getSession({
        headers: c.req.raw.headers,
      });

      if (!sessionData || !sessionData.user) {
        return c.json({ status: 'error', message: 'Unauthorized: Session missing or expired' }, 401);
      }

      // Query latest role and status directly from the database to bypass cookie cache
      const dbUserList = await db
        .select({
          role: users.role,
          status: users.status,
        })
        .from(users)
        .where(eq(users.id, sessionData.user.id))
        .limit(1);

      const dbUser = dbUserList[0];
      if (!dbUser) {
        return c.json({ status: 'error', message: 'Unauthorized: User does not exist' }, 401);
      }

      // Merge latest DB role and status into the user context object
      const mergedUser = {
        ...sessionData.user,
        role: dbUser.role,
        status: dbUser.status,
      };

      c.set('user', mergedUser);
      c.set('session', sessionData.session);
      return await next();
    } catch (err: any) {
      return c.json({ status: 'error', message: 'Unauthorized: Invalid authentication session' }, 401);
    }
  };
};
