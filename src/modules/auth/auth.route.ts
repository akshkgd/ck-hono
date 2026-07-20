import { Hono } from 'hono';
import { auth } from '../../lib/auth.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

const authRouter = new Hono();

// Helper route to get current user profile
authRouter.get('/me', authMiddleware(), (c) => {
  const user = c.get('user' as any);
  const session = c.get('session' as any);
  return c.json({
    status: 'success',
    data: { user, session },
  });
});

// Mount Better Auth HTTP Handler for all Better Auth endpoints (/v1/auth/*)
authRouter.on(['GET', 'POST'], '/*', (c) => {
  return auth.handler(c.req.raw);
});

export default authRouter;
