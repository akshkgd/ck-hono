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

// Debug session & location headers endpoint
authRouter.get('/debug-session', async (c) => {
  const allHeaders: Record<string, string> = {};
  c.req.raw.headers.forEach((val, key) => {
    allHeaders[key] = val;
  });

  const connInfo = getConnInfo(c);
  const clientIp = connInfo?.remote?.address || c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'Unknown';
  
  const country = c.req.header('cf-ipcountry') || c.req.header('x-country') || c.req.header('x-user-country') || c.req.header('country') || 'Unknown';
  const city = c.req.header('cf-ipcity') || c.req.header('x-city') || c.req.header('x-user-city') || c.req.header('city') || 'Unknown';

  let sessionData = null;
  try {
    sessionData = await auth.api.getSession({
      headers: c.req.raw.headers,
    });
  } catch (e: any) {
    console.error('[DebugSession] Error fetching session:', e?.message);
  }

  const debugPayload = {
    timestamp: new Date().toISOString(),
    clientIp,
    detectedLocation: {
      country,
      city,
    },
    locationHeaders: {
      'cf-ipcountry': c.req.header('cf-ipcountry') || null,
      'cf-ipcity': c.req.header('cf-ipcity') || null,
      'x-country': c.req.header('x-country') || null,
      'x-city': c.req.header('x-city') || null,
      'x-user-country': c.req.header('x-user-country') || null,
      'x-user-city': c.req.header('x-user-city') || null,
      'country': c.req.header('country') || null,
      'city': c.req.header('city') || null,
    },
    activeSession: sessionData?.session || null,
    user: sessionData?.user ? { id: sessionData.user.id, email: sessionData.user.email, name: sessionData.user.name } : null,
    allHeaders,
  };

  console.log('[DEBUG SESSION LOG]:', JSON.stringify(debugPayload, null, 2));

  return c.json({
    status: 'success',
    data: debugPayload,
  });
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
      const clientIp = conn?.remote?.address;
      if (clientIp && !headers.has('x-forwarded-for') && !headers.has('x-real-ip')) {
        headers.set('x-forwarded-for', clientIp);
      }
    } catch (connErr) {
      // Ignore conn info errors in testing environment
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

    const response = await auth.handler(normalizedReq);

    // Capture and save session location when Better Auth issues or refreshes a session cookie
    const setCookie = response.headers.get('set-cookie');
    if (setCookie && setCookie.includes('session_token')) {
      const match = setCookie.match(/(?:better-auth\.session_token|__Secure-better-auth\.session_token)=([^;]+)/);
      if (match && match[1]) {
        const rawToken = decodeURIComponent(match[1]).split('.')[0];
        const country = c.req.header('cf-ipcountry') || c.req.header('x-country') || c.req.header('x-user-country') || c.req.header('country') || 'Unknown';
        const city = c.req.header('cf-ipcity') || c.req.header('x-city') || c.req.header('x-user-city') || c.req.header('city') || 'Unknown';

        db.update(session)
          .set({
            country,
            city,
            updatedAt: new Date(),
          })
          .where(eq(session.token, rawToken))
          .catch((err) => console.error('[AuthRoute] Failed to save session location:', err));
      }
    }

    return response;
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
