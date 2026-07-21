import { Hono } from 'hono';
import { auth } from '../../lib/auth.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

const authRouter = new Hono();

/**
 * Fast session getter for frontend load checks.
 * Guarantees 200 OK with null session when unauthenticated,
 * and ensures user.role is always present.
 */
const getSessionHandler = async (c: any) => {
  try {
    const sessionData = await auth.api.getSession({
      headers: c.req.raw.headers,
    });
    if (!sessionData || !sessionData.user) {
      return c.json({ user: null, session: null }, 200);
    }

    const user = sessionData.user as any;
    const userWithDefaults = {
      ...user,
      role: user.role || 'student',
      avatarUrl: user.avatarUrl || user.avatar_url || null,
      mobile: user.mobile || null,
    };

    return c.json({
      session: sessionData.session,
      user: userWithDefaults,
    }, 200);
  } catch (err: any) {
    return c.json({ user: null, session: null }, 200);
  }
};

// Mount fast session routes
authRouter.get('/get-session', getSessionHandler);
authRouter.get('/session', getSessionHandler);

// Profile endpoint
authRouter.get('/me', authMiddleware(), (c) => {
  const user = c.get('user' as any);
  const session = c.get('session' as any);
  return c.json({
    status: 'success',
    data: { user, session },
  });
});

// Primary Better Auth Handler with path normalization (/v1/auth -> /api/auth)
authRouter.on(['GET', 'POST', 'PUT', 'DELETE'], '/*', async (c) => {
  try {
    const rawReq = c.req.raw;
    const url = new URL(rawReq.url);

    // If request route is prefixed with /v1/auth, create normalized Request for Better Auth
    if (url.pathname.includes('/v1/auth')) {
      url.pathname = url.pathname.replace('/v1/auth', '/api/auth');
      const normalizedReq = new Request(url.toString(), {
        method: rawReq.method,
        headers: rawReq.headers,
        body: ['GET', 'HEAD'].includes(rawReq.method) ? undefined : await rawReq.clone().blob(),
      });
      return await auth.handler(normalizedReq);
    }

    return await auth.handler(rawReq);
  } catch (err: any) {
    console.error('[BetterAuth] Handler caught error:', err?.message || err);
    if (c.req.path.includes('session')) {
      return c.json({ user: null, session: null }, 200);
    }
    return c.json({
      status: 'error',
      message: err?.message || 'Authentication request failed',
    }, 400);
  }
});

export default authRouter;
