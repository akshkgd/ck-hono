import { Hono } from 'hono';
import { auth } from '../../lib/auth.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

const authRouter = new Hono();

const getSessionHandler = async (c: any) => {
  try {
    const sessionData = await auth.api.getSession({
      headers: c.req.raw.headers,
    });
    if (!sessionData || !sessionData.user) {
      return c.json({ user: null, session: null }, 200);
    }
    return c.json(sessionData, 200);
  } catch (err: any) {
    console.error('[AuthSession] Handled unauthenticated session check:', err?.message);
    return c.json({ user: null, session: null }, 200);
  }
};

// Explicit session handlers to prevent 500 errors when unauthenticated
authRouter.get('/get-session', getSessionHandler);
authRouter.get('/session', getSessionHandler);

// Helper route to get current user profile
authRouter.get('/me', authMiddleware(), (c) => {
  const user = c.get('user' as any);
  const session = c.get('session' as any);
  return c.json({
    status: 'success',
    data: { user, session },
  });
});

// Mount Better Auth HTTP Handler with error boundary for all endpoints
authRouter.on(['GET', 'POST'], '/*', async (c) => {
  try {
    const res = await auth.handler(c.req.raw);
    return res;
  } catch (err: any) {
    console.error('[BetterAuth] Handler caught exception:', err?.message || err);
    if (c.req.path.includes('/get-session') || c.req.path.includes('/session')) {
      return c.json({ user: null, session: null }, 200);
    }
    return c.json({
      status: 'error',
      message: err?.message || 'Authentication request failed',
    }, 400);
  }
});

export default authRouter;
