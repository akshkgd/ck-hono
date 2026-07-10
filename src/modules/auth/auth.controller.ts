import type { Context } from 'hono';
import { setCookie, deleteCookie, getCookie } from 'hono/cookie';
import { AuthService } from './auth.service.js';
import { loginSchema, registerSchema } from './auth.validation.js';
import { redis, isRedisReady } from '../../utils/redis.js';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  public register = async (c: Context) => {
    try {
      const rawBody = await c.req.json();
      const body = registerSchema.parse(rawBody);

      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        return c.json({
          status: 'error',
          message: 'Internal Server Error',
        }, 500);
      }

      const ipAddress = c.req.header('x-forwarded-for') || 'unknown';
      const userAgent = c.req.header('user-agent') || 'unknown';
      
      const data = await this.authService.register(body, jwtSecret, ipAddress, userAgent);

      setCookie(c, 'token', data.token, {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
      });

      return c.json({
        status: 'success',
        message: 'User registered successfully',
        data,
      }, 201);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Registration failed',
      }, 400);
    }
  };

  public login = async (c: Context) => {
    try {
      const rawBody = await c.req.json();
      const body = loginSchema.parse(rawBody);
      
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        return c.json({
          status: 'error',
          message: 'Internal Server Error',
        }, 500);
      }

      const ipAddress = c.req.header('x-forwarded-for') || 'unknown';
      const userAgent = c.req.header('user-agent') || 'unknown';

      const data = await this.authService.login(body, jwtSecret, ipAddress, userAgent);

      setCookie(c, 'token', data.token, {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
      });

      return c.json({
        status: 'success',
        message: 'Login successful',
        data,
      }, 200);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Login failed',
      }, 401);
    }
  };

  public logout = async (c: Context) => {
    try {
      const user = c.get('user');
      const sessionId = c.get('sessionId');

      if (sessionId && user?.id && redis && isRedisReady()) {
        try {
          await redis.del(`session:${user.id}:${sessionId}`);
        } catch (err) {
          console.error('[Redis] Failed to delete session on logout:', err);
        }
      }

      deleteCookie(c, 'token', {
        path: '/',
        secure: true,
        sameSite: 'Strict',
        httpOnly: true,
      });

      return c.json({
        status: 'success',
        message: 'Logout successful',
      }, 200);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Logout failed',
      }, 400);
    }
  };

  public refresh = async (c: Context) => {
    try {
      const token = getCookie(c, 'token');
      if (!token) {
        return c.json({
          status: 'error',
          message: 'Unauthorized: Missing token cookie',
        }, 401);
      }

      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        return c.json({
          status: 'error',
          message: 'Internal Server Error',
        }, 500);
      }

      const ipAddress = c.req.header('x-forwarded-for') || 'unknown';
      const userAgent = c.req.header('user-agent') || 'unknown';

      const data = await this.authService.refreshSession(token, jwtSecret, ipAddress, userAgent);

      setCookie(c, 'token', data.token, {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
      });

      return c.json({
        status: 'success',
        message: 'Token refreshed successfully',
        data,
      }, 200);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Token refresh failed',
      }, 401);
    }
  };

  public me = async (c: Context) => {
    const user = c.get('user');
    return c.json({
      status: 'success',
      data: { user },
    }, 200);
  };
}
