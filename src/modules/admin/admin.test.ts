import { describe, it, expect, beforeAll } from 'vitest';
import 'dotenv/config';
import app from '../../app.js';

describe('Admin User Management Module', () => {
  let adminToken = '';
  let userToken = '';
  let targetUserId = '';
  
  const testEmail = `admin-test-${Date.now()}@example.com`;
  const testPassword = 'Password123!';

  // Set up auth tokens for admin and regular user before running tests
  beforeAll(async () => {
    // 1. Acquire Admin Token (aarav.sharma0@example.com is seeded as admin)
    const adminRes = await app.request('/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'aarav.sharma0@example.com',
        password: 'Password123!'
      })
    });
    
    if (adminRes.status === 200) {
      const adminBody = await adminRes.json();
      adminToken = adminBody.data.token;
    }

    // 2. Acquire Standard User Token (ananya.verma1@example.com is seeded as user)
    const userRes = await app.request('/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'ananya.verma1@example.com',
        password: 'Password123!'
      })
    });

    if (userRes.status === 200) {
      const userBody = await userRes.json();
      userToken = userBody.data.token;
    }
  });

  // --- ACCESS CONTROL TESTS (RBAC) ---
  describe('RBAC Authorization Guard', () => {
    it('should reject non-admin users with 403 Forbidden', async () => {
      expect(userToken).toBeTruthy();

      const res = await app.request('/v1/admin/users', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${userToken}` }
      });

      expect(res.status).toBe(403);
      const body = await res.json();
      expect(body.status).toBe('error');
      expect(body.message).toContain('Forbidden');
    });

    it('should reject unauthenticated requests with 401 Unauthorized', async () => {
      const res = await app.request('/v1/admin/users', {
        method: 'GET'
      });

      expect(res.status).toBe(401);
      const body = await res.json();
      expect(body.status).toBe('error');
    });
  });

  // --- ADMIN OPERATIONS ---
  describe('Admin Operations', () => {
    it('should allow admin to add a new user', async () => {
      expect(adminToken).toBeTruthy();

      const res = await app.request('/v1/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          email: testEmail,
          password: testPassword,
          name: 'Admin Added User',
          role: 'student',
          status: 'active'
        })
      });

      expect(res.status).toBe(201);
      const body = await res.json();
      expect(body.status).toBe('success');
      expect(body.data.email).toBe(testEmail);
      expect(body.data.role).toBe('student');
      
      targetUserId = body.data.id;
    });

    it('should allow admin to search users by name/email with pagination', async () => {
      expect(adminToken).toBeTruthy();

      const res = await app.request('/v1/admin/users?q=Admin&limit=5&page=1', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.status).toBe('success');
      expect(body.data).toHaveProperty('users');
      expect(body.data.users.length).toBeGreaterThan(0);
      expect(body.data.pagination.page).toBe(1);
      expect(body.data.pagination).toHaveProperty('total');
      expect(typeof body.data.pagination.total).toBe('number');
    });

    it('should allow admin to edit a user profile', async () => {
      expect(adminToken).toBeTruthy();
      expect(targetUserId).toBeTruthy();

      const res = await app.request(`/v1/admin/users/${targetUserId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          name: 'Admin Updated User Name',
          experienceYears: 4
        })
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.status).toBe('success');
      expect(body.data.name).toBe('Admin Updated User Name');
      expect(body.data.experienceYears).toBe(4);
    });

    it('should allow admin to update a user role', async () => {
      expect(adminToken).toBeTruthy();
      expect(targetUserId).toBeTruthy();

      const res = await app.request(`/v1/admin/users/${targetUserId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          role: 'moderator'
        })
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.status).toBe('success');
      expect(body.data.role).toBe('moderator');
    });

    it('should allow admin to suspend a user (update status)', async () => {
      expect(adminToken).toBeTruthy();
      expect(targetUserId).toBeTruthy();

      const res = await app.request(`/v1/admin/users/${targetUserId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          status: 'suspended'
        })
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.status).toBe('success');
      expect(body.data.status).toBe('suspended');
    });

    it('should allow admin to retrieve detailed user profile stats', async () => {
      expect(adminToken).toBeTruthy();
      expect(targetUserId).toBeTruthy();

      const res = await app.request(`/v1/admin/users/${targetUserId}/details`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.status).toBe('success');
      expect(body.data).toHaveProperty('user');
      expect(body.data).toHaveProperty('enrollments');
      expect(body.data).toHaveProperty('activeSessions');
      expect(body.data.user.id).toBe(targetUserId);
    });

    it('should allow admin to delete a user', async () => {
      expect(adminToken).toBeTruthy();
      expect(targetUserId).toBeTruthy();

      const res = await app.request(`/v1/admin/users/${targetUserId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.status).toBe('success');
      expect(body.message).toContain('deleted');
    });
  });
});
