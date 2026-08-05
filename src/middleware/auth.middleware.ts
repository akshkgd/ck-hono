import type { MiddlewareHandler } from 'hono';
import { auth } from '../lib/auth.js';
import { db } from '../db/index.js';
import { session as sessionSchema, users } from '../db/schema.js';
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

      // Normalize IP and lazy-backfill session location data asynchronously (0ms API latency)
      const sessionObj = sessionData.session as any;
      if (sessionObj && sessionObj.id) {
        const rawIp = sessionObj.ipAddress || '';
        const isMappedIp = rawIp.startsWith('::ffff:');
        const incomingCountry = c.req.header('cf-ipcountry') || c.req.header('x-country');
        const incomingCity = c.req.header('cf-ipcity') || c.req.header('x-city');

        const isLocationMissing = !sessionObj.country;
        const isLocationChanged = (incomingCountry && incomingCountry !== sessionObj.country) || 
                                  (incomingCity && incomingCity !== sessionObj.city);

        if (isMappedIp || isLocationMissing || isLocationChanged) {
          const normalizedIp = rawIp.replace(/^::ffff:/, '');
          const newCountry = incomingCountry || sessionObj.country || 'Unknown';
          const newCity = incomingCity || sessionObj.city || null;

          if (normalizedIp) sessionObj.ipAddress = normalizedIp;
          if (newCountry) sessionObj.country = newCountry;
          if (newCity) sessionObj.city = newCity;

          db.update(sessionSchema)
            .set({
              ipAddress: normalizedIp || sessionObj.ipAddress,
              country: newCountry,
              city: newCity,
              updatedAt: new Date(),
            })
            .where(eq(sessionSchema.id, sessionObj.id))
            .catch((err) => console.error('[AuthMiddleware] Failed to update session location:', err));
        }
      }

      c.set('user', mergedUser);
      c.set('session', sessionObj);
      return await next();
    } catch (err: any) {
      return c.json({ status: 'error', message: 'Unauthorized: Invalid authentication session' }, 401);
    }
  };
};
