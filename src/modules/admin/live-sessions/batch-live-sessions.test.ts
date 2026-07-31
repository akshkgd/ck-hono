import { describe, it, expect, beforeAll } from 'vitest';
import 'dotenv/config';
import app from '../../../app.js';

describe('Batch-Specific Live Sessions Feature Module', () => {
  let adminToken = '';
  let studentToken = '';
  let studentBatchId = '';
  let testSectionId = '';
  let testLiveSessionId = '';

  beforeAll(async () => {
    // 1. Acquire Admin Token
    const adminRes = await app.request('/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'aarav.sharma0@example.com',
        password: 'Password123!'
      })
    });
    if (adminRes.status === 200) {
      const body = await adminRes.json();
      adminToken = body.data.token;
    }

    // 2. Acquire Student Token
    const studentRes = await app.request('/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'ananya.verma1@example.com',
        password: 'Password123!'
      })
    });
    if (studentRes.status === 200) {
      const body = await studentRes.json();
      studentToken = body.data.token;
    }

    // 3. Query student enrolled courses to find a batchId and sectionId
    const coursesRes = await app.request('/v1/student/courses', {
      headers: { 'Authorization': `Bearer ${studentToken}` }
    });
    if (coursesRes.status === 200) {
      const body = await coursesRes.json();
      const firstCourse = body.data.courses[0];
      if (firstCourse) {
        studentBatchId = firstCourse.batchId;
      }
    }

    // 4. Query batch details / preview to find a sectionId we can assign the live session to
    if (studentBatchId) {
      const previewRes = await app.request(`/v1/admin/batches/${studentBatchId}/preview`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      if (previewRes.status === 200) {
        const body = await previewRes.json();
        const firstSection = body.data.sections[0];
        if (firstSection) {
          testSectionId = firstSection.id;
        }
      }
    }
  });

  describe('POST /v1/admin/batches/:batchId/live-sessions - Create Live Session', () => {
    it('should reject unauthorized requests', async () => {
      const res = await app.request(`/v1/admin/batches/${studentBatchId || 'dummy'}/live-sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: 'Unauthorized Session',
          time: new Date().toISOString()
        })
      });
      expect(res.status).toBe(401);
    });

    it('should reject non-admin users', async () => {
      const res = await app.request(`/v1/admin/batches/${studentBatchId || 'dummy'}/live-sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${studentToken}`
        },
        body: JSON.stringify({
          topic: 'Student Attempting Admin Action',
          time: new Date().toISOString()
        })
      });
      expect(res.status).toBe(403);
    });

    it('should allow admin to create a live session with valid details', async () => {
      if (!studentBatchId) return;

      const res = await app.request(`/v1/admin/batches/${studentBatchId}/live-sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          topic: 'Introduction to PostgreSQL Indexes',
          desc: 'In this session, we will cover indexes, execution plans, and performance optimization.',
          time: new Date().toISOString(),
          sectionId: testSectionId || null,
          screenHlsVideo: 'https://video.codekaro.in/hls/postres-indexes-screen.m3u8',
          faceHlsVideo: 'https://video.codekaro.in/hls/postres-indexes-face.m3u8',
          recordingHls: 'https://video.codekaro.in/hls/postres-indexes-recording.m3u8',
          order: 5
        })
      });

      expect(res.status).toBe(201);
      const body = await res.json();
      expect(body.status).toBe('success');
      expect(body.data.id).toBeDefined();
      expect(body.data.topic).toBe('Introduction to PostgreSQL Indexes');
      testLiveSessionId = body.data.id;
    });

    it('should fail validation on invalid properties', async () => {
      if (!studentBatchId) return;

      const res = await app.request(`/v1/admin/batches/${studentBatchId}/live-sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          topic: '', // blank topic (fails min 1 constraint)
          time: 'invalid-date'
        })
      });

      expect(res.status).toBe(400);
    });
  });

  describe('GET & PATCH /v1/admin/live-sessions/:id - Read/Update Live Session', () => {
    it('should allow admin to get live session details', async () => {
      if (!testLiveSessionId) return;

      const res = await app.request(`/v1/admin/live-sessions/${testLiveSessionId}`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.status).toBe('success');
      expect(body.data.topic).toBe('Introduction to PostgreSQL Indexes');
    });

    it('should allow admin to update live session details', async () => {
      if (!testLiveSessionId) return;

      const res = await app.request(`/v1/admin/live-sessions/${testLiveSessionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          topic: 'Optimizing PostgreSQL Indexes & Joins',
          order: 8
        })
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.status).toBe('success');
      expect(body.data.topic).toBe('Optimizing PostgreSQL Indexes & Joins');
      expect(body.data.order).toBe(8);
    });
  });

  describe('GET /v1/admin/batches/:batchId/live-sessions - List Sessions (Admin)', () => {
    it('should return live sessions scheduled for the batch', async () => {
      if (!studentBatchId) return;

      const res = await app.request(`/v1/admin/batches/${studentBatchId}/live-sessions`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.status).toBe('success');
      expect(body.data.length).toBeGreaterThan(0);
      const testSession = body.data.find((s: any) => s.id === testLiveSessionId);
      expect(testSession).toBeDefined();
    });
  });

  describe('GET /v1/student/batches/:batchId/live-sessions - List Sessions (Student)', () => {
    it('should reject access if student is not enrolled', async () => {
      const res = await app.request('/v1/student/batches/a0000000-0000-0000-0000-000000000000/live-sessions', {
        headers: { 'Authorization': `Bearer ${studentToken}` }
      });
      expect(res.status).toBe(403);
    });

    it('should return live sessions for enrolled student', async () => {
      if (!studentBatchId) return;

      const res = await app.request(`/v1/student/batches/${studentBatchId}/live-sessions`, {
        headers: { 'Authorization': `Bearer ${studentToken}` }
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.status).toBe('success');
      expect(body.data.length).toBeGreaterThan(0);
    });
  });

  describe('Curriculum Hierarchy Tree Integration', () => {
    it('should integrate live session under the section in GET /v1/admin/batches/:id/preview', async () => {
      if (!studentBatchId) return;

      const res = await app.request(`/v1/admin/batches/${studentBatchId}/preview`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.status).toBe('success');

      // Find the section that we mapped it to
      const section = body.data.sections.find((s: any) => s.id === testSectionId);
      if (section) {
        const liveItem = section.contents.find((c: any) => c.id === testLiveSessionId);
        expect(liveItem).toBeDefined();
        expect(liveItem.type).toBe('live_session');
        expect(liveItem.content.title).toBe('Optimizing PostgreSQL Indexes & Joins');
      }
    });

    it('should integrate live session under the section in student GET /v1/student/courses/:id', async () => {
      if (!studentBatchId) return;

      const res = await app.request(`/v1/student/courses/${studentBatchId}`, {
        headers: { 'Authorization': `Bearer ${studentToken}` }
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.status).toBe('success');

      const section = body.data.sections.find((s: any) => s.id === testSectionId);
      if (section) {
        const liveItem = section.contents.find((c: any) => c.id === testLiveSessionId);
        expect(liveItem).toBeDefined();
        expect(liveItem.type).toBe('live_session');
        expect(liveItem.content.contentType).toBe('live_session');
        expect(liveItem.content.title).toBe('Optimizing PostgreSQL Indexes & Joins');
      }
    });

    it('should track student attendance and progress when student joins and leaves the live session', async () => {
      if (!studentBatchId || !testLiveSessionId) return;

      // 1. Simulate Student joining: POST /v1/admin/live-sessions/attendance with status "joined"
      const joinRes = await app.request('/v1/admin/live-sessions/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          email: 'ananya.verma1@example.com',
          liveSessionId: testLiveSessionId,
          status: 'joined'
        })
      });

      expect(joinRes.status).toBe(200);
      const joinBody = await joinRes.json();
      expect(joinBody.status).toBe('success');
      expect(joinBody.data.status).toBe('learning');
      expect(joinBody.data.liveSessionTimeSpent).toBe(0);

      // 2. Fetch student details to verify status is "learning" and liveSessionTimeSpent is 0
      const courseRes1 = await app.request(`/v1/student/courses/${studentBatchId}`, {
        headers: { 'Authorization': `Bearer ${studentToken}` }
      });
      const courseBody1 = await courseRes1.json();
      const section1 = courseBody1.data.sections.find((s: any) => s.id === testSectionId);
      const liveItem1 = section1?.contents.find((c: any) => c.id === testLiveSessionId);
      expect(liveItem1?.progress.status).toBe('learning');
      expect(liveItem1?.progress.timeSpent).toBe(0);
      expect(liveItem1?.progress.liveSessionTimeSpent).toBe(0);

      // 3. Simulate Student leaving: POST /v1/admin/live-sessions/attendance with status "left"
      const leaveRes = await app.request('/v1/admin/live-sessions/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          email: 'ananya.verma1@example.com',
          liveSessionId: testLiveSessionId,
          status: 'left',
          durationSeconds: 2700 // 45 minutes
        })
      });

      expect(leaveRes.status).toBe(200);
      const leaveBody = await leaveRes.json();
      expect(leaveBody.status).toBe('success');
      expect(leaveBody.data.status).toBe('completed');
      expect(leaveBody.data.liveSessionTimeSpent).toBe(2700);

      // 4. Fetch student details to verify status is "completed" and time spent is 2700
      const courseRes2 = await app.request(`/v1/student/courses/${studentBatchId}`, {
        headers: { 'Authorization': `Bearer ${studentToken}` }
      });
      const courseBody2 = await courseRes2.json();
      const section2 = courseBody2.data.sections.find((s: any) => s.id === testSectionId);
      const liveItem2 = section2?.contents.find((c: any) => c.id === testLiveSessionId);
      expect(liveItem2?.progress.status).toBe('completed');
      expect(liveItem2?.progress.timeSpent).toBe(2700);
      expect(liveItem2?.progress.liveSessionTimeSpent).toBe(2700);
    });
  });

  describe('DELETE /v1/admin/live-sessions/:id - Delete Live Session', () => {
    it('should allow admin to delete the session', async () => {
      if (!testLiveSessionId) return;

      const res = await app.request(`/v1/admin/live-sessions/${testLiveSessionId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });

      expect(res.status).toBe(200);

      // Verify deletion in details
      const detailRes = await app.request(`/v1/admin/live-sessions/${testLiveSessionId}`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      expect(detailRes.status).toBe(400); // throws "Live session not found"
    });
  });
});
