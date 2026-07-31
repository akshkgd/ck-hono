import { Hono } from 'hono';
import { getConnInfo } from '@hono/node-server/conninfo';
import { auth } from '../../lib/auth.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { db } from '../../db/index.js';
import { users, session } from '../../db/schema.js';
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

authRouter.get('/debug-sessions', authMiddleware(), async (c) => {
  try {
    const user = c.get('user' as any);
    const dbUsers = await db.select().from(users).where(eq(users.id, user.id));
    const allSessions = await db.select().from(session);
    return c.json({
      status: 'success',
      userContextId: user.id,
      dbUser: dbUsers[0] || null,
      totalSessionsInDb: allSessions.length,
      allSessionsInDb: allSessions,
    }, 200);
  } catch (err: any) {
    return c.json({ status: 'error', message: err.message }, 500);
  }
});

// Primary Better Auth Handler with path normalization (/v1/auth -> /api/auth)
authRouter.on(['GET', 'POST', 'PUT', 'DELETE'], '/*', async (c) => {
  try {
    const rawReq = c.req.raw;
    const url = new URL(rawReq.url);

    // Copy headers and inject client IP if missing from incoming request headers
    const headers = new Headers(rawReq.headers);
    try {
      const conn = getConnInfo(c);
      const clientIp = conn.remote.address;
      if (clientIp && !headers.has('x-forwarded-for') && !headers.has('x-real-ip')) {
        headers.set('x-forwarded-for', clientIp);
      }
    } catch (connErr) {
      console.warn('[BetterAuth] Failed to get connection info for IP logging:', connErr);
    }

    // Path normalization (/v1/auth -> /api/auth)
    const isV1Auth = url.pathname.includes('/v1/auth');
    if (isV1Auth) {
      url.pathname = url.pathname.replace('/v1/auth', '/api/auth');
    }

    const normalizedReq = new Request(url.toString(), {
      method: rawReq.method,
      headers: headers,
      body: ['GET', 'HEAD'].includes(rawReq.method) ? undefined : await rawReq.clone().blob(),
    });

    return await auth.handler(normalizedReq);
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
