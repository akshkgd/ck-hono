import { describe, it, expect, beforeAll } from 'vitest';
import 'dotenv/config';
import app from '../../app.js';

describe('Reported Bugs Feature Module', () => {
  let adminToken = '';
  let studentToken = '';
  let testBugId = '';

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
  });

  describe('POST /v1/student/bugs - Bug Reporting (Student)', () => {
    it('should reject unauthorized requests', async () => {
      const res = await app.request('/v1/student/bugs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: 'This bug should be rejected.'
        })
      });
      expect(res.status).toBe(401);
    });

    it('should allow student to report a bug', async () => {
      const res = await app.request('/v1/student/bugs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${studentToken}`
        },
        body: JSON.stringify({
          description: 'Clicking the settings page button results in a blank page.',
          severity: 'medium',
          url: 'https://app.codekaro.in/settings',
          deviceInfo: { browser: 'Chrome 122', os: 'macOS' }
        })
      });

      expect(res.status).toBe(201);
      const body = await res.json();
      expect(body.status).toBe('success');
      expect(body.data.id).toBeDefined();
      expect(body.data.url).toBe('https://app.codekaro.in/settings');
      expect(body.data.status).toBe('pending');
      testBugId = body.data.id;
    });

    it('should fail validation when description is too short', async () => {
      const res = await app.request('/v1/student/bugs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${studentToken}`
        },
        body: JSON.stringify({
          description: 'No'
        })
      });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /v1/admin/bugs - Bugs Tracking (Admin)', () => {
    it('should reject standard student requests', async () => {
      const res = await app.request('/v1/admin/bugs', {
        headers: { 'Authorization': `Bearer ${studentToken}` }
      });
      expect(res.status).toBe(403);
    });

    it('should allow admin to list reported bugs', async () => {
      const res = await app.request('/v1/admin/bugs', {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.status).toBe('success');
      expect(body.data.bugs).toBeInstanceOf(Array);
      expect(body.data.pagination.total).toBeGreaterThanOrEqual(1);
    });

    it('should support searching and status filtering', async () => {
      const res = await app.request('/v1/admin/bugs?status=pending&q=settings', {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.data.bugs.length).toBeGreaterThanOrEqual(1);
      expect(body.data.bugs[0].status).toBe('pending');
    });
  });

  describe('GET /v1/admin/bugs/:id - Bug Details (Admin)', () => {
    it('should allow admin to get bug details by id', async () => {
      const res = await app.request(`/v1/admin/bugs/${testBugId}`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.status).toBe('success');
      expect(body.data.id).toBe(testBugId);
      expect(body.data.user.email).toBe('ananya.verma1@example.com');
    });

    it('should return 404 for non-existent bug id', async () => {
      const nonExistentId = '12345678-1234-1234-1234-123456789012';
      const res = await app.request(`/v1/admin/bugs/${nonExistentId}`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      expect(res.status).toBe(404);
    });
  });

  describe('PUT /v1/admin/bugs/:id - Update Bug Status (Admin)', () => {
    it('should allow admin to resolve a bug and add remarks', async () => {
      const res = await app.request(`/v1/admin/bugs/${testBugId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          status: 'resolved',
          remarks: 'Fixed the navigation link mapping in config.'
        })
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.data.status).toBe('resolved');
      expect(body.data.remarks).toBe('Fixed the navigation link mapping in config.');
    });
  });

  describe('DELETE /v1/admin/bugs/:id - Delete Bug (Admin)', () => {
    it('should allow admin to delete bug', async () => {
      const res = await app.request(`/v1/admin/bugs/${testBugId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });

      expect(res.status).toBe(200);

      // Verify deletion
      const checkRes = await app.request(`/v1/admin/bugs/${testBugId}`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      expect(checkRes.status).toBe(404);
    });
  });
});
