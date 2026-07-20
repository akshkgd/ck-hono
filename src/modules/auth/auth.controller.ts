import { Context } from 'hono';
import { setCookie, deleteCookie, getCookie } from 'hono/cookie';
import { authService, SESSION_DURATION_SECONDS } from './auth.service.js';

export class AuthController {
  /**
   * Request Magic Link email
   */
  async requestMagicLink(c: Context) {
    const body = await c.req.json();
    const result = await authService.requestMagicLink(body);
    return c.json({
      status: 'success',
      message: result.message,
      data: result,
    }, 200);
  }

  /**
   * Verify Magic Link token and create 30-day session
   */
  async verifyMagicLink(c: Context) {
    let token = c.req.query('token') || '';
    if (!token && c.req.header('Content-Type')?.includes('application/json')) {
      try {
        const body = await c.req.json();
        token = body.token || '';
      } catch {
        // Fallback
      }
    }

    if (!token) {
      return c.json({ status: 'error', message: 'Token is required' }, 400);
    }

    const ipAddress = c.req.header('x-forwarded-for') || c.req.header('cf-connecting-ip') || undefined;
    const userAgent = c.req.header('user-agent') || undefined;

    const result = await authService.verifyMagicLink({ token }, ipAddress, userAgent);

    // Set secure 30-day HTTP-Only Cookie
    setCookie(c, 'session_token', result.sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: SESSION_DURATION_SECONDS, // 30 Days
      path: '/',
    });

    return c.json({
      status: 'success',
      message: 'Magic link verified successfully! Logged in for 30 days.',
      data: {
        sessionToken: result.sessionToken,
        user: result.user,
        expiresAt: result.expiresAt,
      },
    }, 200);
  }

  /**
   * Logout single session
   */
  async logout(c: Context) {
    let sessionToken = getCookie(c, 'session_token') || getCookie(c, 'token') || '';
    if (!sessionToken) {
      const authHeader = c.req.header('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        sessionToken = authHeader.substring(7);
      }
    }

    if (sessionToken) {
      await authService.logout(sessionToken);
    }

    deleteCookie(c, 'session_token', { path: '/' });
    deleteCookie(c, 'token', { path: '/' });

    return c.json({
      status: 'success',
      message: 'Logged out successfully',
    }, 200);
  }

  /**
   * Get current authenticated user profile
   */
  async getMe(c: Context) {
    const user = c.get('user');
    return c.json({
      status: 'success',
      data: { user },
    }, 200);
  }
}

export const authController = new AuthController();
