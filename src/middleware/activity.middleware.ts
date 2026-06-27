import type { MiddlewareHandler } from 'hono';
import { redis, isRedisReady } from '../utils/redis.js';
import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export const activityMiddleware = (): MiddlewareHandler => {
  return async (c, next) => {
    await next();

    // Retrieve user from context (populated by authMiddleware)
    const user = c.get('user');
    if (!user || !user.id) {
      return;
    }

    const userId = user.id;

    if (redis && isRedisReady()) {
      try {
        const lockKey = `user:${userId}:active_lock`;
        const lockExists = await redis.exists(lockKey);
        
        if (!lockExists) {
          // Set active lock key with 15 minutes TTL (900 seconds)
          await redis.setex(lockKey, 900, '1');

          // Asynchronously update the user last_active_at field in PostgreSQL
          db.update(users)
            .set({ lastActiveAt: new Date() })
            .where(eq(users.id, userId))
            .catch((err) => {
              console.error('[Activity] Failed to update PostgreSQL activity timestamp:', err);
            });
        }
      } catch (err) {
        console.error('[Activity] Redis throttling check failed:', err);
      }
    } else {
      // Fallback: If Redis is offline during development, update directly
      db.update(users)
        .set({ lastActiveAt: new Date() })
        .where(eq(users.id, userId))
        .catch((err) => {
          console.error('[Activity] Fallback failed to update PostgreSQL activity timestamp:', err);
        });
    }
  };
};
