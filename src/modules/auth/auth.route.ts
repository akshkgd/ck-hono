import { Hono } from 'hono';
import { auth } from '../../lib/auth.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { db } from '../../db/index.js';
import { users } from '../../db/schema.js';
import { eq } from 'drizzle-orm';

const authRouter = new Hono();

/**
 * Fast session getter for frontend load checks.
 * Returns exact JSON structure expected by frontend:
 * {
 *   "user": { "id": "...", "email": "...", "name": "...", "role": "admin" | "student", "avatarUrl": "...", "mobile": "..." },
 *   "session": { "id": "...", "token": "...", "expiresAt": "..." }
 * }
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
    const session = sessionData.session as any;

    // Fetch latest user details from DB to bypass cookie cache for profile details/streak/xp
    const dbUserList = await db
      .select({
        name: users.name,
        role: users.role,
        status: users.status,
        avatarUrl: users.avatarUrl,
        mobile: users.mobile,
        bio: users.bio,
        linkedinUrl: users.linkedinUrl,
        githubUrl: users.githubUrl,
        occupationType: users.occupationType,
        occupationTitle: users.occupationTitle,
        organization: users.organization,
        experienceYears: users.experienceYears,
        xp: users.xp,
        currentStreak: users.currentStreak,
        longestStreak: users.longestStreak,
        lastActiveAt: users.lastActiveAt,
      })
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1);

    const dbUser = dbUserList[0] || {};

    // Reject immediately if user is suspended/inactive
    if (dbUser.status === 'suspended' || dbUser.status === 'inactive') {
      return c.json({ user: null, session: null }, 200);
    }

    const formattedUser = {
      id: user.id,
      email: user.email,
      name: dbUser.name || user.name || null,
      role: dbUser.role || user.role || 'student',
      status: dbUser.status || user.status || 'active',
      avatarUrl: dbUser.avatarUrl || user.avatarUrl || user.avatar_url || null,
      mobile: dbUser.mobile || user.mobile || null,
      bio: dbUser.bio || null,
      linkedinUrl: dbUser.linkedinUrl || null,
      githubUrl: dbUser.githubUrl || null,
      occupationType: dbUser.occupationType || 'other',
      occupationTitle: dbUser.occupationTitle || null,
      organization: dbUser.organization || null,
      experienceYears: dbUser.experienceYears || null,
      xp: dbUser.xp ?? 0,
      currentStreak: dbUser.currentStreak ?? 0,
      longestStreak: dbUser.longestStreak ?? 0,
      lastActiveAt: dbUser.lastActiveAt ?? null,
    };

    const formattedSession = {
      id: session.id,
      token: session.token,
      expiresAt: session.expiresAt,
    };

    return c.json({
      user: formattedUser,
      session: formattedSession,
    }, 200);
  } catch (err: any) {
    return c.json({ user: null, session: null }, 200);
  }
};

// Mount fast session routes
authRouter.get('/get-session', getSessionHandler);
authRouter.get('/session', getSessionHandler);

// Profile endpoint
authRouter.get('/me', authMiddleware(), async (c) => {
  const user = c.get('user' as any);
  const session = c.get('session' as any);

  // Fetch latest user details from DB to bypass cookie cache for profile details/streak/xp
  const dbUserList = await db
    .select({
      name: users.name,
      role: users.role,
      status: users.status,
      avatarUrl: users.avatarUrl,
      mobile: users.mobile,
      bio: users.bio,
      linkedinUrl: users.linkedinUrl,
      githubUrl: users.githubUrl,
      occupationType: users.occupationType,
      occupationTitle: users.occupationTitle,
      organization: users.organization,
      experienceYears: users.experienceYears,
      xp: users.xp,
      currentStreak: users.currentStreak,
      longestStreak: users.longestStreak,
      lastActiveAt: users.lastActiveAt,
    })
    .from(users)
    .where(eq(users.id, user.id))
    .limit(1);

  const dbUser = dbUserList[0] || {};

  // Reject immediately if user is suspended/inactive
  if (dbUser.status === 'suspended' || dbUser.status === 'inactive') {
    return c.json({ status: 'error', message: 'Unauthorized: User is suspended or inactive' }, 401);
  }

  return c.json({
    status: 'success',
    data: {
      user: {
        ...user,
        name: dbUser.name || user.name || null,
        role: dbUser.role || user.role || 'student',
        status: dbUser.status || user.status || 'active',
        avatarUrl: dbUser.avatarUrl || user.avatarUrl || user.avatar_url || null,
        mobile: dbUser.mobile || user.mobile || null,
        bio: dbUser.bio || null,
        linkedinUrl: dbUser.linkedinUrl || null,
        githubUrl: dbUser.githubUrl || null,
        occupationType: dbUser.occupationType || 'other',
        occupationTitle: dbUser.occupationTitle || null,
        organization: dbUser.organization || null,
        experienceYears: dbUser.experienceYears || null,
        xp: dbUser.xp ?? 0,
        currentStreak: dbUser.currentStreak ?? 0,
        longestStreak: dbUser.longestStreak ?? 0,
        lastActiveAt: dbUser.lastActiveAt ?? null,
      },
      session,
    },
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
