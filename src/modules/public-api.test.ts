import { describe, it, expect, beforeAll } from 'vitest';
import app from '../app.js';
import { db } from '../db/index.js';
import { users, batchLiveSessions, batches, batchEnrollments } from '../db/schema.js';

describe('Public APIs (User Profile, Live Session Details & Public Attendance)', () => {
  const unique = Date.now();
  const activeEmail = `active.public.${unique}@example.com`;
  const inactiveEmail = `inactive.public.${unique}@example.com`;
  const enrolledStudentEmail = `enrolled.student.${unique}@example.com`;
  let activeUserId = '';
  let enrolledStudentUserId = '';
  let liveSessionId = '';

  beforeAll(async () => {
    // Insert active user
    const [activeUser] = await db.insert(users).values({
      email: activeEmail,
      name: 'Active Public User',
      avatarUrl: 'https://example.com/avatar.png',
      status: 'active',
    }).returning();
    activeUserId = activeUser.id;

    // Insert inactive user
    await db.insert(users).values({
      email: inactiveEmail,
      name: 'Inactive Public User',
      avatarUrl: 'https://example.com/inactive-avatar.png',
      status: 'inactive',
    });

    // Insert enrolled student user
    const [studentUser] = await db.insert(users).values({
      email: enrolledStudentEmail,
      name: 'Enrolled Attendance Student',
      status: 'active',
    }).returning();
    enrolledStudentUserId = studentUser.id;

    // Create a batch first for FK reference
    const [batch] = await db.insert(batches).values({
      name: `Public Session Test Batch ${unique}`,
      topic: 'Testing Public Sessions',
      startDate: '2026-07-01',
      endDate: '2026-10-01',
    }).returning();

    // Enroll student in batch
    await db.insert(batchEnrollments).values({
      userId: studentUser.id,
      batchId: batch.id,
      accessTill: '2027-01-01',
    });

    // Insert live session
    const [session] = await db.insert(batchLiveSessions).values({
      batchId: batch.id,
      topic: 'Public Masterclass on System Design',
      desc: 'Learn high-level system design patterns.',
      time: new Date('2026-09-01T10:00:00Z'),
      screenHlsVideo: 'https://example.com/screen/playlist.m3u8',
      faceHlsVideo: 'https://example.com/face/playlist.m3u8',
      dummyCount: 150,
    }).returning();

    liveSessionId = session.id;
  });

  describe('GET /v1/users/public', () => {
    it('should return 400 if email parameter is missing or invalid', async () => {
      const res1 = await app.request('/v1/users/public');
      expect(res1.status).toBe(400);

      const res2 = await app.request('/v1/users/public?email=not-an-email');
      expect(res2.status).toBe(400);
    });

    it('should return 404 if email does not exist', async () => {
      const res = await app.request('/v1/users/public?email=nonexistent@example.com');
      expect(res.status).toBe(404);
      const body = await res.json();
      expect(body.status).toBe('error');
      expect(body.message).toBe('User not found');
    });

    it('should return 404 if user status is inactive', async () => {
      const res = await app.request(`/v1/users/public?email=${encodeURIComponent(inactiveEmail)}`);
      expect(res.status).toBe(404);
      const body = await res.json();
      expect(body.status).toBe('error');
      expect(body.message).toBe('User not found');
    });

    it('should return 200 with id, name, email, avatar for an active user', async () => {
      const res = await app.request(`/v1/users/public?email=${encodeURIComponent(activeEmail)}`);
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.status).toBe('success');
      expect(body.data).toEqual({
        id: activeUserId,
        name: 'Active Public User',
        email: activeEmail,
        avatar: 'https://example.com/avatar.png',
      });
      expect(Object.keys(body.data)).toEqual(['id', 'name', 'email', 'avatar']);
    });
  });

  describe('GET /v1/live-sessions/:id/public', () => {
    it('should return 400 if id is not a valid UUID', async () => {
      const res = await app.request('/v1/live-sessions/invalid-uuid/public');
      expect(res.status).toBe(400);
    });

    it('should return 404 if live session ID does not exist', async () => {
      const res = await app.request('/v1/live-sessions/00000000-0000-0000-0000-000000000000/public');
      expect(res.status).toBe(404);
      const body = await res.json();
      expect(body.status).toBe('error');
      expect(body.message).toBe('Live session not found');
    });

    it('should return 200 with public live session details', async () => {
      const res = await app.request(`/v1/live-sessions/${liveSessionId}/public`);
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.status).toBe('success');
      expect(body.data.topic).toBe('Public Masterclass on System Design');
      expect(body.data.desc).toBe('Learn high-level system design patterns.');
      expect(body.data.screenHLS).toBe('https://example.com/screen/playlist.m3u8');
      expect(body.data.FaceHLS).toBe('https://example.com/face/playlist.m3u8');
      expect(body.data.screenHlsVideo).toBe('https://example.com/screen/playlist.m3u8');
      expect(body.data.faceHlsVideo).toBe('https://example.com/face/playlist.m3u8');
      expect(body.data.dummyCount).toBe(150);
    });
  });

  describe('POST /v1/live-sessions/attendance/public', () => {
    it('should return 400 when durationSeconds is missing for status left', async () => {
      const res = await app.request('/v1/live-sessions/attendance/public', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: enrolledStudentUserId,
          liveSessionId,
          status: 'left',
        }),
      });
      expect(res.status).toBe(400);
    });

    it('should return 404 if student is not enrolled in the batch for this session', async () => {
      const res = await app.request('/v1/live-sessions/attendance/public', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: activeUserId, // active user but not enrolled in this batch
          liveSessionId,
          status: 'joined',
        }),
      });
      expect(res.status).toBe(404);
      const body = await res.json();
      expect(body.message).toBe('Enrollment not found for this student and live session');
    });

    it('should handle multi-join workflow using userId and correctly accumulate duration across sessions', async () => {
      // 1. First Join (0 mins)
      const join1 = await app.request('/v1/live-sessions/attendance/public', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: enrolledStudentUserId,
          liveSessionId,
          status: 'joined',
        }),
      });
      expect(join1.status).toBe(200);
      const bodyJoin1 = await join1.json();
      expect(bodyJoin1.data.status).toBe('learning');
      expect(bodyJoin1.data.liveSessionTimeSpent).toBe(0);

      // 2. First Leave after 5 mins (300 seconds)
      const leave1 = await app.request('/v1/live-sessions/attendance/public', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: enrolledStudentUserId,
          liveSessionId,
          status: 'left',
          durationSeconds: 300,
        }),
      });
      expect(leave1.status).toBe(200);
      const bodyLeave1 = await leave1.json();
      expect(bodyLeave1.data.status).toBe('completed');
      expect(bodyLeave1.data.liveSessionTimeSpent).toBe(300);

      // 3. Second Join (after break) -> Should preserve existing 300s
      const join2 = await app.request('/v1/live-sessions/attendance/public', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: enrolledStudentUserId,
          liveSessionId,
          status: 'joined',
        }),
      });
      expect(join2.status).toBe(200);
      const bodyJoin2 = await join2.json();
      expect(bodyJoin2.data.status).toBe('learning');
      expect(bodyJoin2.data.liveSessionTimeSpent).toBe(300);

      // 4. Second Leave after 7 mins (420 seconds) -> Should accumulate to 300 + 420 = 720s
      const leave2 = await app.request('/v1/live-sessions/attendance/public', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: enrolledStudentUserId,
          liveSessionId,
          status: 'left',
          durationSeconds: 420,
        }),
      });
      expect(leave2.status).toBe(200);
      const bodyLeave2 = await leave2.json();
      expect(bodyLeave2.data.status).toBe('completed');
      expect(bodyLeave2.data.liveSessionTimeSpent).toBe(720);
    });
  });
});
