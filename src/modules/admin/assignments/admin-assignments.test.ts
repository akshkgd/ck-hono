import { describe, it, expect, beforeAll } from 'vitest';
import app from '../../../app.js';

describe('Admin Assignments Manager Module', () => {
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

  it('should reject unauthenticated request with 401 on GET /v1/admin/assignments', async () => {
    const res = await app.request('/v1/admin/assignments', {
      method: 'GET'
    });
    expect(res.status).toBe(401);
  });

  it('should reject non-admin request with 403 on GET /v1/admin/assignments', async () => {
    const res = await app.request('/v1/admin/assignments', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    });
    expect(res.status).toBe(403);
  });

  it('should return assignments list successfully for admin', async () => {
    const res = await app.request('/v1/admin/assignments?timeRange=this_week', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe('success');
    expect(body.data).toHaveProperty('submissions');
    expect(body.data).toHaveProperty('pagination');
  });

  it('should fail with 400 when grading submission with invalid status', async () => {
    const res = await app.request('/v1/admin/assignments/12/grade', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        assignmentStatus: 'InvalidStatus',
        teacherRemark: 'Needs rework'
      })
    });
    expect(res.status).toBe(400);
  });

  it('should reject unauthenticated request with 401 on GET /v1/admin/assignments/enrollments/:enrollmentId', async () => {
    const res = await app.request('/v1/admin/assignments/enrollments/1', {
      method: 'GET'
    });
    expect(res.status).toBe(401);
  });

  it('should reject non-admin request with 403 on GET /v1/admin/assignments/enrollments/:enrollmentId', async () => {
    const res = await app.request('/v1/admin/assignments/enrollments/1', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    });
    expect(res.status).toBe(403);
  });

  it('should return 400 with descriptive error if enrollment does not exist', async () => {
    const res = await app.request('/v1/admin/assignments/enrollments/99999', {
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
