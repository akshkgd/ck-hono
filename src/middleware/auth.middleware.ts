import type { MiddlewareHandler } from 'hono';
import { auth } from '../lib/auth.js';
import { db } from '../db/index.js';
import { session as sessionSchema, users } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { cleanClientIp, lookupIpLocation } from '../utils/ip-geo.js';

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
        const clientIp = c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || sessionObj.ipAddress || '';
        const normalizedIp = cleanClientIp(clientIp) || cleanClientIp(sessionObj.ipAddress) || '';
        const isMappedIp = sessionObj.ipAddress && sessionObj.ipAddress.startsWith('::ffff:');

        const incomingCountry = c.req.header('cf-ipcountry') || c.req.header('x-country') || c.req.header('x-user-country') || c.req.header('country');
        const incomingCity = c.req.header('cf-ipcity') || c.req.header('x-city') || c.req.header('x-user-city') || c.req.header('city');

        const isLocationUnknown = !sessionObj.country || sessionObj.country === 'Unknown' || !sessionObj.city || sessionObj.city === 'Unknown';
        const isLocationChanged = (incomingCountry && incomingCountry !== sessionObj.country) || 
                                  (incomingCity && incomingCity !== sessionObj.city);

        if (isMappedIp || isLocationUnknown || isLocationChanged) {
          (async () => {
            let newCountry = incomingCountry || sessionObj.country;
            let newCity = incomingCity || sessionObj.city;

            if ((!newCountry || newCountry === 'Unknown' || !newCity || newCity === 'Unknown') && normalizedIp) {
              const geo = await lookupIpLocation(normalizedIp);
              if (geo.country !== 'Unknown') newCountry = geo.country;
              if (geo.city !== 'Unknown') newCity = geo.city;
            }

            newCountry = newCountry || 'Unknown';
            newCity = newCity || 'Unknown';

            sessionObj.ipAddress = normalizedIp || sessionObj.ipAddress;
            sessionObj.country = newCountry;
            sessionObj.city = newCity;

            await db.update(sessionSchema)
              .set({
                ipAddress: sessionObj.ipAddress,
                country: newCountry,
                city: newCity,
                updatedAt: new Date(),
              })
              .where(eq(sessionSchema.id, sessionObj.id));
          })().catch((err) => console.error('[AuthMiddleware] Failed to update session location:', err));
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
