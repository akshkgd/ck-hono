import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import 'dotenv/config';
import app from '../../../app.js';
import { db } from '../../../db/index.js';
import { users, batches, batchEnrollments, learnerWatchlist, session as sessionSchema } from '../../../db/schema.js';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

describe('Admin Learner Watchlist Module', () => {
  let adminToken = '';
  let studentToken = '';
  let testUserId: string;
  let testBatchId: string;
  let testEnrollmentId: string;
  let createdWatchlistId: string;

  beforeAll(async () => {
    // 1. Create Admin User & Session
    const [adminUser] = await db.insert(users).values({
      email: `admin_wl_${Date.now()}@example.com`,
      name: 'Watchlist Admin Test',
      role: 'admin',
      status: 'active',
    }).returning();

    adminToken = uuidv4();
    await db.insert(sessionSchema).values({
      id: uuidv4(),
      userId: adminUser.id,
      token: adminToken,
      expiresAt: new Date(Date.now() + 86400 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // 2. Create Student User & Session
    const [studentUser] = await db.insert(users).values({
      email: `student_wl_${Date.now()}@example.com`,
      name: 'Watchlist Student Test',
      role: 'student',
      status: 'active',
    }).returning();
    testUserId = studentUser.id;

    studentToken = uuidv4();
    await db.insert(sessionSchema).values({
      id: uuidv4(),
      userId: studentUser.id,
      token: studentToken,
      expiresAt: new Date(Date.now() + 86400 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // 3. Create Batch & Enrollment
    const [batch] = await db.insert(batches).values({
      name: 'Watchlist Testing Cohort',
      price: 4999,
      renewalFee: 1999,
      type: 'cohort',
      status: 'active',
      startDate: '2026-07-01',
      endDate: '2026-10-01',
    }).returning();
    testBatchId = batch.id;

    const [enrollment] = await db.insert(batchEnrollments).values({
      userId: testUserId,
      batchId: testBatchId,
      amountPayable: 4999,
      amountPaid: 4999,
      paymentStatus: 'captured',
      status: 1,
      progress: 50,
      timeSpentSeconds: 3600,
    }).returning();
    testEnrollmentId = enrollment.id;
  });

  afterAll(async () => {
    if (createdWatchlistId) {
      await db.delete(learnerWatchlist).where(eq(learnerWatchlist.id, createdWatchlistId));
    }
    if (testEnrollmentId) {
      await db.delete(batchEnrollments).where(eq(batchEnrollments.id, testEnrollmentId));
    }
    if (testBatchId) {
      await db.delete(batches).where(eq(batches.id, testBatchId));
    }
    if (testUserId) {
      await db.delete(users).where(eq(users.id, testUserId));
    }
  });

  describe('Access Control', () => {
    it('should reject unauthenticated requests with 401', async () => {
      const res = await app.request('/v1/admin/watchlist', { method: 'GET' });
      expect(res.status).toBe(401);
    });

    it('should reject non-admin student requests with 403', async () => {
      const res = await app.request('/v1/admin/watchlist', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${studentToken}` },
      });
      expect(res.status).toBe(403);
    });
  });

  describe('Watchlist CRUD Operations', () => {
    it('should allow admin to add a student enrollment to the watchlist', async () => {
      const res = await app.request('/v1/admin/watchlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          enrollmentId: testEnrollmentId,
          reason: 'Needs close monitoring due to low lecture completion',
        }),
      });

      expect(res.status).toBe(201);
      const body = await res.json();
      expect(body.status).toBe('success');
      expect(body.data.enrollmentId).toBe(testEnrollmentId);
      expect(body.data.reason).toBe('Needs close monitoring due to low lecture completion');

      createdWatchlistId = body.data.id;
    });

    it('should list watchlisted learners with detailed progress, lectures, and assignments metrics', async () => {
      const res = await app.request(`/v1/admin/watchlist?batchId=${testBatchId}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${adminToken}` },
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.status).toBe('success');
      expect(body.data.length).toBeGreaterThanOrEqual(1);

      const item = body.data.find((i: any) => i.watchlistId === createdWatchlistId);
      expect(item).toBeDefined();
      expect(item.userId).toBe(testUserId);
      expect(item.batchName).toBe('Watchlist Testing Cohort');
      expect(item.progressPercent).toBe(50);
      expect(item.timeSpentSeconds).toBe(3600);
      expect(item.formattedTimeSpent).toBe('1h 0m');
      expect(item.lectures).toHaveProperty('watched');
      expect(item.lectures).toHaveProperty('total');
      expect(item.lectures).toHaveProperty('display');
      expect(item.assignments).toHaveProperty('submitted');
      expect(item.assignments).toHaveProperty('total');
      expect(item.assignments).toHaveProperty('display');
      expect(item.reason).toBe('Needs close monitoring due to low lecture completion');
    });

    it('should allow updating remark/reason for a watchlisted learner', async () => {
      const updatedReason = 'Student contacted; progress resuming next week';
      const res = await app.request(`/v1/admin/watchlist/${createdWatchlistId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          reason: updatedReason,
        }),
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.status).toBe('success');
      expect(body.data.reason).toBe(updatedReason);
    });

    it('should allow removing a learner from the watchlist', async () => {
      const res = await app.request(`/v1/admin/watchlist/${createdWatchlistId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${adminToken}` },
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.status).toBe('success');
      expect(body.message).toContain('removed');
    });
  });
});
