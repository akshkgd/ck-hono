import { describe, it, expect, beforeAll } from 'vitest';
import app from '../../../app.js';

describe('Admin Batches CRUD Module', () => {
  let adminToken = '';
  let userToken = '';
  let createdBatchId: number;
  
  const uniqueSlug = `test-batch-${Date.now()}`;
  const testBatchData = {
    name: 'Mastering TypeScript & Hono',
    topic: 'Web Development',
    description: 'Learn modern backend development using Hono and TypeScript.',
    slug: uniqueSlug,
    price: 499,
    certificateFee: 50,
    limit: 100,
    type: 'cohort',
    startDate: '2026-07-01',
    endDate: '2026-08-01',
    status: 'private',
    metadata: { cohortNumber: 1 }
  };

  beforeAll(async () => {
    // Acquire Admin Token
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

    // Acquire Standard User Token
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

  describe('Access Control Checks', () => {
    it('should reject unauthenticated requests with 401 Unauthorized', async () => {
      const res = await app.request('/v1/admin/batches', { method: 'GET' });
      expect(res.status).toBe(401);
    });

    it('should reject standard user requests with 403 Forbidden', async () => {
      const res = await app.request('/v1/admin/batches', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${userToken}` }
      });
      expect(res.status).toBe(403);
    });
  });

  describe('CRUD Operations', () => {
    it('should allow admin to create a new batch', async () => {
      const res = await app.request('/v1/admin/batches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(testBatchData)
      });

      expect(res.status).toBe(201);
      const body = await res.json();
      expect(body.status).toBe('success');
      expect(body.message).toContain('created');
      expect(body.data.name).toBe(testBatchData.name);
      expect(body.data.slug).toBe(testBatchData.slug);
      
      createdBatchId = body.data.id;
      expect(createdBatchId).toBeTypeOf('number');
    });

    it('should reject creating a batch with a duplicate slug', async () => {
      const res = await app.request('/v1/admin/batches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(testBatchData)
      });

      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.status).toBe('error');
      expect(body.message).toContain('slug already exists');
    });

    it('should allow admin to search batches', async () => {
      const res = await app.request(`/v1/admin/batches?q=Mastering&limit=5&page=1`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.status).toBe('success');
      expect(body.data.batches).toBeInstanceOf(Array);
      expect(body.data.batches.length).toBeGreaterThan(0);
      expect(body.data.pagination.total).toBeGreaterThan(0);
    });

    it('should allow admin to fetch a single batch by ID', async () => {
      const res = await app.request(`/v1/admin/batches/${createdBatchId}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.status).toBe('success');
      expect(body.data.id).toBe(createdBatchId);
      expect(body.data.name).toBe(testBatchData.name);
    });

    it('should allow admin to update a batch', async () => {
      const updatedName = 'Mastering TypeScript & Hono v2';
      const res = await app.request(`/v1/admin/batches/${createdBatchId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          name: updatedName,
          price: 599,
          type: 'live'
        })
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.status).toBe('success');
      expect(body.data.name).toBe(updatedName);
      expect(body.data.price).toBe(599);
      expect(body.data.type).toBe('live');
    });

    it('should allow admin to delete a batch', async () => {
      const res = await app.request(`/v1/admin/batches/${createdBatchId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.status).toBe('success');
      expect(body.message).toContain('deleted');

      // Verify deletion
      const checkRes = await app.request(`/v1/admin/batches/${createdBatchId}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      expect(checkRes.status).toBe(400);
      const checkBody = await checkRes.json();
      expect(checkBody.message).toContain('not found');
    });
  });
});
