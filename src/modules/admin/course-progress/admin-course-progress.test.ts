import { describe, it, expect, beforeAll } from 'vitest';
import app from '../../../app.js';

describe('Admin Course Progress Analytics Module', () => {
  let adminToken = '';
  let userToken = '';

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

    // 2. Acquire Standard User Token
    const userRes = await app.request('/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'ananya.verma1@example.com',
        password: 'Password123!'
      })
    });
    if (userRes.status === 200) {
      const body = await userRes.json();
      userToken = body.data.token;
    }
  });

  it('should reject unauthenticated request with 401 on GET /v1/admin/course-progress', async () => {
    const res = await app.request('/v1/admin/course-progress', {
      method: 'GET'
    });
    expect(res.status).toBe(401);
  });

  it('should reject non-admin request with 403 on GET /v1/admin/course-progress', async () => {
    const res = await app.request('/v1/admin/course-progress', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    });
    expect(res.status).toBe(403);
  });

  it('should return progress log list and aggregates successfully for admin', async () => {
    const res = await app.request('/v1/admin/course-progress?timeRange=this_week', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe('success');
    expect(body.data).toHaveProperty('analytics');
    expect(body.data).toHaveProperty('chartData');
    expect(body.data).toHaveProperty('progressLogs');
    expect(body.data).toHaveProperty('pagination');

    const analytics = body.data.analytics;
    expect(analytics).toHaveProperty('totalUsers');
    expect(analytics).toHaveProperty('totalTimeSpentSeconds');
    expect(analytics).toHaveProperty('dailyAverageTimeSpentSeconds');
    expect(analytics).toHaveProperty('totalViews');
  });

  it('should fail with 400 when custom range dates are missing', async () => {
    const res = await app.request('/v1/admin/course-progress?timeRange=custom', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });
    expect(res.status).toBe(400);
  });

  it('should reject unauthenticated request with 401 on GET /v1/admin/course-progress/enrollments/:enrollmentId', async () => {
    const res = await app.request('/v1/admin/course-progress/enrollments/1', {
      method: 'GET'
    });
    expect(res.status).toBe(401);
  });

  it('should reject non-admin request with 403 on GET /v1/admin/course-progress/enrollments/:enrollmentId', async () => {
    const res = await app.request('/v1/admin/course-progress/enrollments/1', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    });
    expect(res.status).toBe(403);
  });

  it('should return 400 with descriptive error if enrollment does not exist', async () => {
    const res = await app.request('/v1/admin/course-progress/enrollments/99999', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.status).toBe('error');
    expect(body.message).toContain('Enrollment not found');
  });

  it('should reject unauthenticated request with 401 on POST /v1/admin/course-progress/assignments/reset-submitted', async () => {
    const res = await app.request('/v1/admin/course-progress/assignments/reset-submitted', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    expect(res.status).toBe(401);
  });

  it('should reject non-admin request with 403 on POST /v1/admin/course-progress/assignments/reset-submitted', async () => {
    const res = await app.request('/v1/admin/course-progress/assignments/reset-submitted', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({})
    });
    expect(res.status).toBe(403);
  });

  it('should allow resetting submitted assignments to pending for admin', async () => {
    const res = await app.request('/v1/admin/course-progress/assignments/reset-submitted', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({})
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe('success');
    expect(body.data).toHaveProperty('count');
  });

  it('should reject unauthenticated request with 401 on POST /v1/admin/course-progress/bulk-update', async () => {
    const res = await app.request('/v1/admin/course-progress/bulk-update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: '989c5a03-dbb7-49ab-ac19-1a6156b83ea1',
        batchId: '768bc964-7c8e-4fd7-8dd0-0a328e9f82d4',
        items: []
      })
    });
    expect(res.status).toBe(401);
  });

  it('should reject non-admin request with 403 on POST /v1/admin/course-progress/bulk-update', async () => {
    const res = await app.request('/v1/admin/course-progress/bulk-update', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: '989c5a03-dbb7-49ab-ac19-1a6156b83ea1',
        batchId: '768bc964-7c8e-4fd7-8dd0-0a328e9f82d4',
        items: []
      })
    });
    expect(res.status).toBe(403);
  });

  it('should return 400 when invalid input is provided to bulk-update', async () => {
    const res = await app.request('/v1/admin/course-progress/bulk-update', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: 'invalid-uuid',
        batchId: '768bc964-7c8e-4fd7-8dd0-0a328e9f82d4',
        items: []
      })
    });
    expect(res.status).toBe(400);
  });

  it('should return 400 with descriptive error if enrollment/user does not exist', async () => {
    const res = await app.request('/v1/admin/course-progress/bulk-update', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: '989c5a03-dbb7-49ab-ac19-1a6156b83ea1',
        batchId: '768bc964-7c8e-4fd7-8dd0-0a328e9f82d4',
        items: [
          {
            batchContentId: '768bc964-7c8e-4fd7-8dd0-0a328e9f82d4',
            watchMinutes: 10,
            completed: false
          }
        ]
      })
    });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.status).toBe('error');
    expect(body.message).toContain('not enrolled');
  });
});

