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

    const runUpdate = async () => {
      // 1. Fetch current streaks and last active date from DB
      const dbUser = await db.select({
        lastActiveAt: users.lastActiveAt,
        currentStreak: users.currentStreak,
        longestStreak: users.longestStreak,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)
      .then(res => res[0]);

      if (!dbUser) return;

      const now = new Date();
      const getLocalDateStr = (d: Date) => d.toISOString().split('T')[0];
      const todayStr = getLocalDateStr(now);
      const lastActiveStr = getLocalDateStr(dbUser.lastActiveAt);

      let newCurrentStreak = dbUser.currentStreak;
      let newLongestStreak = dbUser.longestStreak;

      // Handle streak logic based on calendar day difference
      if (dbUser.currentStreak === 0) {
        // First activity ever/new user
        newCurrentStreak = 1;
        newLongestStreak = Math.max(1, dbUser.longestStreak);
      } else if (todayStr !== lastActiveStr) {
        const msPerDay = 24 * 60 * 60 * 1000;
        const diffInMs = new Date(todayStr).getTime() - new Date(lastActiveStr).getTime();
        const diffInDays = Math.round(diffInMs / msPerDay);

        if (diffInDays === 1) {
          // Consecutive day
          newCurrentStreak = dbUser.currentStreak + 1;
        } else if (diffInDays > 1) {
          // Streak broken
          newCurrentStreak = 1;
        } // For diffInDays < 0 (clock drift or backdated testing), we keep the current values
        
        newLongestStreak = Math.max(newCurrentStreak, dbUser.longestStreak);
      }

      await db.update(users)
        .set({
          lastActiveAt: now,
          currentStreak: newCurrentStreak,
          longestStreak: newLongestStreak,
          updatedAt: now,
        })
        .where(eq(users.id, userId));
    };

    if (redis && isRedisReady()) {
      try {
        const lockKey = `user:${userId}:active_lock`;
        const lockExists = await redis.exists(lockKey);
        
        if (!lockExists) {
          // Set active lock key with 15 minutes TTL (900 seconds)
          await redis.setex(lockKey, 900, '1');

          // Asynchronously update streak and timestamp
          runUpdate().catch((err) => {
            console.error('[Activity] Failed to update user streak and activity status:', err);
          });
        }
      } catch (err) {
        console.error('[Activity] Redis throttling check failed:', err);
      }
    } else {
      // Fallback: If Redis is offline during development, update directly
      runUpdate().catch((err) => {
        console.error('[Activity] Fallback failed to update user streak and activity status:', err);
      });
    }
  };
};

