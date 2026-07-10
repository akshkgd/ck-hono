import type { MiddlewareHandler } from 'hono';
import { verify } from 'hono/jwt';
import { getCookie } from 'hono/cookie';
import { UserRepository } from '../modules/users/user.repository.js';
import { redis, isRedisReady } from '../utils/redis.js';

export const authMiddleware = (): MiddlewareHandler => {
  const userRepository = new UserRepository();

  return async (c, next) => {
    let token = getCookie(c, 'token') || '';
    if (!token) {
      const authHeader = c.req.header('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      } else {
        token = c.req.query('token') || '';
      }
    }

    if (!token) {
      return c.json({ status: 'error', message: 'Unauthorized: Missing or invalid token' }, 401);
    }

    const jwtSecret = process.env.JWT_SECRET;
    
    if (!jwtSecret) {
      console.error('JWT_SECRET is not configured in environment variables');
      return c.json({ status: 'error', message: 'Internal Server Error' }, 500);
    }

    try {
      const decoded = await verify(token, jwtSecret, 'HS256');
      if (!decoded || !decoded.id) {
        return c.json({ status: 'error', message: 'Unauthorized: Invalid token payload' }, 401);
      }

      const user = await userRepository.findById(decoded.id as string);
      if (!user) {
        return c.json({ status: 'error', message: 'Unauthorized: User not found' }, 401);
      }

      // Verify session exists in Redis (if Redis is connected)
      if (redis && isRedisReady() && decoded.sessionId) {
        try {
          const sessionExists = await redis.exists(`session:${user.id}:${decoded.sessionId}`);
          if (!sessionExists) {
            return c.json({ status: 'error', message: 'Unauthorized: Session has expired or been logged out' }, 401);
          }
        } catch (err) {
          console.error('[Redis] Session validation failed:', err);
        }
      }

      const { password, ...userWithoutPassword } = user;
      
      // Store user and sessionId in context variables
      c.set('user', userWithoutPassword);
      c.set('sessionId', decoded.sessionId as string);
      await next();
    } catch (err) {
      return c.json({ status: 'error', message: 'Unauthorized: Token verification failed' }, 401);
    }
  };
};
