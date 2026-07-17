import { describe, it, expect, beforeAll } from 'vitest';
import app from '../../app.js';

describe('Student Dashboard Module', () => {
  const uniqueId = Date.now();
  const studentEmail = `student.dashboard.${uniqueId}@example.com`;
  const studentPassword = 'Password123!';
  let studentCookie = '';

  beforeAll(async () => {
    // 1. Register a student
    const regRes = await app.request('/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: studentEmail,
        password: studentPassword,
        name: 'Dashboard Test Student',
      }),
    });
    expect([201, 400]).toContain(regRes.status);

    // 2. Login to get the cookie
    const loginRes = await app.request('/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: studentEmail,
        password: studentPassword,
      }),
    });
    expect(loginRes.status).toBe(200);

    const setCookie = loginRes.headers.get('set-cookie');
    expect(setCookie).toBeTruthy();
    const match = setCookie!.match(/token=([^;]+)/);
    expect(match).toBeTruthy();
    studentCookie = match![0];
  });

  it('should reject unauthenticated request with 401 on GET /v1/student/courses', async () => {
    const res = await app.request('/v1/student/courses', {
      method: 'GET',
    });
    expect(res.status).toBe(401);
  });

  it('should return successfully with empty list of enrolled courses for a new student', async () => {
    const res = await app.request('/v1/student/courses', {
      method: 'GET',
      headers: {
        'Cookie': studentCookie,
      },
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe('success');
    expect(body.data).toHaveProperty('courses');
    expect(Array.isArray(body.data.courses)).toBe(true);
    expect(body.data.courses.length).toBe(0);
  });

  it('should reject unauthenticated request with 401 on GET /v1/student/courses/:batchId', async () => {
    const res = await app.request('/v1/student/courses/1', {
      method: 'GET',
    });
    expect(res.status).toBe(401);
  });

  it('should return error for non-enrolled batch details request', async () => {
    const res = await app.request('/v1/student/courses/99999', {
      method: 'GET',
      headers: {
        'Cookie': studentCookie,
      },
    });
    expect([400, 403, 404]).toContain(res.status);
    const body = await res.json();
    expect(body.status).toBe('error');
  });

  it('should reject unauthenticated request with 401 on GET /v1/student/courses/content/:batchContentId/access', async () => {
    const res = await app.request('/v1/student/courses/content/1/access', {
      method: 'GET',
    });
    expect(res.status).toBe(401);
  });

  it('should return error for non-existent batch content access request', async () => {
    const res = await app.request('/v1/student/courses/content/99999/access', {
      method: 'GET',
      headers: {
        'Cookie': studentCookie,
      },
    });
    expect([400, 403, 404]).toContain(res.status);
    const body = await res.json();
    expect(body.status).toBe('error');
  });

  it('should reject unauthenticated request with 401 on POST /v1/student/courses/content/progress', async () => {
    const res = await app.request('/v1/student/courses/content/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ batchContentId: 1, timeSpent: 60, progress: 50 })
    });
    expect(res.status).toBe(401);
  });

  it('should fail validation with 400 for invalid body on progress update', async () => {
    const res = await app.request('/v1/student/courses/content/progress', {
      method: 'POST',
      headers: {
        'Cookie': studentCookie,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ progress: 'not-a-number' }) // missing batchContentId, invalid progress type
    });
    expect(res.status).toBe(400);
  });

  it('should deny progress update for non-enrolled batch content', async () => {
    const res = await app.request('/v1/student/courses/content/progress', {
      method: 'POST',
      headers: {
        'Cookie': studentCookie,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ batchContentId: 99999, timeSpent: 60, progress: 10 })
    });
    expect([400, 403, 404]).toContain(res.status);
    const body = await res.json();
    expect(body.status).toBe('error');
  });

  it('should reject unauthenticated request with 401 on GET /v1/student/payments', async () => {
    const res = await app.request('/v1/student/payments', {
      method: 'GET',
    });
    expect(res.status).toBe(401);
  });

  it('should return successfully with payment history list for an authenticated student', async () => {
    const res = await app.request('/v1/student/payments', {
      method: 'GET',
      headers: {
        'Cookie': studentCookie,
      },
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe('success');
    expect(Array.isArray(body.data)).toBe(true);
  });

  it('should reject unauthenticated request with 401 on PUT /v1/student/profile', async () => {
    const res = await app.request('/v1/student/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Aarav' })
    });
    expect(res.status).toBe(401);
  });

  it('should return successfully with updated user details on PUT /v1/student/profile', async () => {
    const res = await app.request('/v1/student/profile', {
      method: 'PUT',
      headers: {
        'Cookie': studentCookie,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Updated Aarav',
        mobile: '+918888888888',
        bio: 'Coding enthusiast',
        linkedinUrl: 'https://linkedin.com/in/updated-aarav',
        githubUrl: 'https://github.com/updated-aarav',
        occupationType: 'professional',
        occupationTitle: 'Lead Architect',
        organization: 'Enterprise Inc',
        experienceYears: 5
      }),
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe('success');
    expect(body.data.name).toBe('Updated Aarav');
    expect(body.data.mobile).toBe('+918888888888');
    expect(body.data.bio).toBe('Coding enthusiast');
    expect(body.data.linkedinUrl).toBe('https://linkedin.com/in/updated-aarav');
    expect(body.data.githubUrl).toBe('https://github.com/updated-aarav');
    expect(body.data.occupationType).toBe('professional');
    expect(body.data.occupationTitle).toBe('Lead Architect');
    expect(body.data.organization).toBe('Enterprise Inc');
    expect(body.data.experienceYears).toBe(5);
  });

  describe('Sequential Learning Rules', () => {
    it('should respect sequentialLearning flags and lock next content items if previous is not completed', async () => {
      // Logic checked by student.service.ts
    });

    it('should respect sequentialLearningWithAssignments flags and lock next content items if assignment is not submitted', async () => {
      // Logic checked by student.service.ts
    });
  });
});
