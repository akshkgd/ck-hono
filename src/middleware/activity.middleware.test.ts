import { Hono } from 'hono';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { activityMiddleware } from './activity.middleware.js';
import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { redis, isRedisReady } from '../utils/redis.js';

describe('Activity Middleware Streak Tracking', () => {
  let testUser: any = null;
  let originalState: any = null;

  // Set up mock Hono app
  const mockApp = new Hono<{ Variables: { user: any } }>();
  
  mockApp.use('*', async (c, next) => {
    if (testUser) {
      c.set('user', testUser);
    }
    await next();
  });
  
  mockApp.use('*', activityMiddleware());
  
  mockApp.get('/test', (c) => c.json({ ok: true }));

  beforeAll(async () => {
    // Fetch a seeded user to perform streak tests on
    const existing = await db.select()
      .from(users)
      .where(eq(users.email, 'ananya.verma1@example.com'))
      .limit(1)
      .then(res => res[0]);

    if (!existing) {
      throw new Error('Test user ananya.verma1@example.com not found in database');
    }

    testUser = { id: existing.id, email: existing.email };
    originalState = {
      lastActiveAt: existing.lastActiveAt,
      currentStreak: existing.currentStreak,
      longestStreak: existing.longestStreak,
    };
  });

  afterAll(async () => {
    // Restore user to original state after tests complete
    if (testUser && originalState) {
      await db.update(users)
        .set({
          lastActiveAt: originalState.lastActiveAt,
          currentStreak: originalState.currentStreak,
          longestStreak: originalState.longestStreak,
        })
        .where(eq(users.id, testUser.id));
    }
  });

  const clearRedisLock = async () => {
    if (redis && isRedisReady()) {
      await redis.del(`user:${testUser.id}:active_lock`);
    }
  };

  it('Scenario 1: New User/Streak 0 -> should initialize streak to 1', async () => {
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

    // Setup initial state in DB
    await db.update(users)
      .set({
        currentStreak: 0,
        longestStreak: 0,
        lastActiveAt: fiveDaysAgo,
      })
      .where(eq(users.id, testUser.id));

    await clearRedisLock();

    // Trigger activity
    await mockApp.request('/test');

    // Wait for async update to complete
    await new Promise((resolve) => setTimeout(resolve, 150));

    // Assert DB state
    const updated = await db.select().from(users).where(eq(users.id, testUser.id)).limit(1).then(res => res[0]);
    expect(updated.currentStreak).toBe(1);
    expect(updated.longestStreak).toBe(1);
  });

  it('Scenario 2: Same Day Activity -> should not increment streak', async () => {
    const now = new Date();

    // Setup initial state in DB
    await db.update(users)
      .set({
        currentStreak: 3,
        longestStreak: 5,
        lastActiveAt: now,
      })
      .where(eq(users.id, testUser.id));

    await clearRedisLock();

    // Trigger activity
    await mockApp.request('/test');

    // Wait for async update to complete
    await new Promise((resolve) => setTimeout(resolve, 150));

    // Assert DB state
    const updated = await db.select().from(users).where(eq(users.id, testUser.id)).limit(1).then(res => res[0]);
    expect(updated.currentStreak).toBe(3);
    expect(updated.longestStreak).toBe(5);
  });

  it('Scenario 3: Consecutive Day Activity -> should increment streak and update longestStreak if applicable', async () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    // Setup initial state in DB
    await db.update(users)
      .set({
        currentStreak: 3,
        longestStreak: 5,
        lastActiveAt: yesterday,
      })
      .where(eq(users.id, testUser.id));

    await clearRedisLock();

    // Trigger activity
    await mockApp.request('/test');

    // Wait for async update to complete
    await new Promise((resolve) => setTimeout(resolve, 150));

    // Assert DB state
    const updated = await db.select().from(users).where(eq(users.id, testUser.id)).limit(1).then(res => res[0]);
    expect(updated.currentStreak).toBe(4);
    expect(updated.longestStreak).toBe(5);
  });

  it('Scenario 4: Broken Streak -> should reset streak to 1', async () => {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    // Setup initial state in DB
    await db.update(users)
      .set({
        currentStreak: 4,
        longestStreak: 5,
        lastActiveAt: threeDaysAgo,
      })
      .where(eq(users.id, testUser.id));

    await clearRedisLock();

    // Trigger activity
    await mockApp.request('/test');

    // Wait for async update to complete
    await new Promise((resolve) => setTimeout(resolve, 150));

    // Assert DB state
    const updated = await db.select().from(users).where(eq(users.id, testUser.id)).limit(1).then(res => res[0]);
    expect(updated.currentStreak).toBe(1);
    expect(updated.longestStreak).toBe(5);
  });
});
