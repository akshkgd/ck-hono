import { Context } from 'hono';
import { authService } from './auth.service.js';
import { auth } from '../../lib/auth.js';

export class AuthController {
  /**
   * Request Magic Link email
   */
  async requestMagicLink(c: Context) {
    const body = await c.req.json();
    const result = await authService.requestMagicLink(body.email);
    return c.json({
      status: 'success',
      data: result,
    }, 200);
  }

  /**
   * Logout session
   */
  async logout(c: Context) {
    await auth.api.signOut({
      headers: c.req.raw.headers,
    });

    return c.json({
      status: 'success',
      message: 'Logged out successfully',
    }, 200);
  }

  /**
   * Get current authenticated user profile
   */
  async getMe(c: Context) {
    const user = c.get('user' as any);
    const session = c.get('session' as any);
    return c.json({
      status: 'success',
      data: { user, session },
    }, 200);
  }
}

export const authController = new AuthController();
