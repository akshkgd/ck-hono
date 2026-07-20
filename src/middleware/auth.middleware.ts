import type { MiddlewareHandler } from 'hono';
import { getCookie } from 'hono/cookie';
import crypto from 'crypto';
import { redis, isRedisReady } from '../utils/redis.js';
import { sessionRepository } from '../modules/auth/session.repository.js';
import { SESSION_DURATION_SECONDS } from '../modules/auth/auth.service.js';

function hashToken(rawToken: string): string {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
}

export const authMiddleware = (): MiddlewareHandler => {
  return async (c, next) => {
    let rawToken = getCookie(c, 'session_token') || getCookie(c, 'token') || '';
    if (!rawToken) {
      const authHeader = c.req.header('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        rawToken = authHeader.substring(7);
      } else {
        rawToken = c.req.query('token') || '';
      }
    }

    if (!rawToken) {
      return c.json({ status: 'error', message: 'Unauthorized: Missing or invalid session token' }, 401);
    }

    const sessionTokenHash = hashToken(rawToken);

    // 1. Try $O(1)$ Redis fast cache lookup
    if (redis && isRedisReady()) {
      try {
        const cachedStr = await redis.get(`session:${sessionTokenHash}`);
        if (cachedStr) {
          const cachedData = JSON.parse(cachedStr);
          c.set('user', cachedData.user);
          c.set('sessionId', cachedData.sessionId);
          return await next();
        }
      } catch (redisErr) {
        console.error('[AuthMiddleware] Redis lookup failed, falling back to DB:', redisErr);
      }
    }

    // 2. Fallback to PostgreSQL indexed lookup
    const dbSessionRecord = await sessionRepository.findValidSessionWithUser(sessionTokenHash);
    if (!dbSessionRecord) {
      return c.json({ status: 'error', message: 'Unauthorized: Session has expired or been revoked' }, 401);
    }

    const { user, session } = dbSessionRecord;
    const { password, ...userWithoutPassword } = user;

    // Warm Redis cache for subsequent O(1) requests
    if (redis && isRedisReady()) {
      try {
        const remainingSeconds = Math.max(
          1,
          Math.floor((new Date(session.expiresAt).getTime() - Date.now()) / 1000)
        );
        await redis.setex(
          `session:${sessionTokenHash}`,
          Math.min(remainingSeconds, SESSION_DURATION_SECONDS),
          JSON.stringify({
            sessionId: session.id,
            userId: user.id,
            user: userWithoutPassword,
            expiresAt: session.expiresAt.toISOString(),
          })
        );
      } catch (redisErr) {
        console.error('[AuthMiddleware] Redis cache warming failed:', redisErr);
      }
    }

    // Touch session asynchronously
    sessionRepository.touchSession(session.id).catch(() => {});

    c.set('user', userWithoutPassword);
    c.set('sessionId', session.id);
    return await next();
  };
};
