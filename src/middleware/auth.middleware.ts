import type { MiddlewareHandler } from 'hono';
import { verify } from 'hono/jwt';
import { UserRepository } from '../modules/users/user.repository.js';

export const authMiddleware = (): MiddlewareHandler => {
  const userRepository = new UserRepository();

  return async (c, next) => {
    const authHeader = c.req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ status: 'error', message: 'Unauthorized: Missing or invalid token' }, 401);
    }

    const token = authHeader.substring(7);
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

      const { password, ...userWithoutPassword } = user;
      
      // Store user in context variables
      c.set('user', userWithoutPassword);
      await next();
    } catch (err) {
      return c.json({ status: 'error', message: 'Unauthorized: Token verification failed' }, 401);
    }
  };
};
