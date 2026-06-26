import type { Context } from 'hono';
import { AuthService } from './auth.service.js';
import { loginSchema, registerSchema } from './auth.validation.js';

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

      const data = await this.authService.login(body, jwtSecret);
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

  public me = async (c: Context) => {
    const user = c.get('user');
    return c.json({
      status: 'success',
      data: { user },
    }, 200);
  };
}
