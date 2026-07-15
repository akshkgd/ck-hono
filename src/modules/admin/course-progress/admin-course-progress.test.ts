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

  it('should reject unauthenticated request with 401 on GET /v1/admin/course-progress/users/:userId/batches/:batchId', async () => {
    const fakeUuid = '00000000-0000-0000-0000-000000000000';
    const res = await app.request(`/v1/admin/course-progress/users/${fakeUuid}/batches/1`, {
      method: 'GET'
    });
    expect(res.status).toBe(401);
  });

  it('should reject non-admin request with 403 on GET /v1/admin/course-progress/users/:userId/batches/:batchId', async () => {
    const fakeUuid = '00000000-0000-0000-0000-000000000000';
    const res = await app.request(`/v1/admin/course-progress/users/${fakeUuid}/batches/1`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    });
    expect(res.status).toBe(403);
  });

  it('should return 400 with descriptive error if enrollment does not exist', async () => {
    const fakeUuid = '00000000-0000-0000-0000-000000000000';
    const res = await app.request(`/v1/admin/course-progress/users/${fakeUuid}/batches/99999`, {
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
});
