import type { Context } from 'hono';
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
      
      const user = await this.authService.register(body);
      return c.json({
        status: 'success',
        message: 'User registered successfully',
        data: user,
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

  public me = async (c: Context) => {
    const user = c.get('user');
    return c.json({
      status: 'success',
      data: { user },
    }, 200);
  };
}
