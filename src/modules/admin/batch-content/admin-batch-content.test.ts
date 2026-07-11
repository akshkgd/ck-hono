import { describe, it, expect, beforeAll } from 'vitest';
import app from '../../../app.js';

describe('Admin Batch Contents Bulk Association Module', () => {
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

  it('should reject unauthenticated request with 401 on POST /v1/admin/batch-contents/bulk', async () => {
    const res = await app.request('/v1/admin/batch-contents/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        batchId: 1,
        sectionId: 1,
        items: [{ contentId: 1, accessOn: 0, accessTill: 30 }]
      })
    });
    expect(res.status).toBe(401);
  });

  it('should reject non-admin request with 403 on POST /v1/admin/batch-contents/bulk', async () => {
    const res = await app.request('/v1/admin/batch-contents/bulk', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        batchId: 1,
        sectionId: 1,
        items: [{ contentId: 1, accessOn: 0, accessTill: 30 }]
      })
    });
    expect(res.status).toBe(403);
  });

  it('should return successfully with 201 and created records array for admin', async () => {
    // Let's use batchId: 1 and sectionId: 1 and contentId: 1 (which are seeded in standard tests)
    const res = await app.request('/v1/admin/batch-contents/bulk', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        batchId: 1,
        sectionId: 1,
        items: [
          { contentId: 1, accessOn: 0, accessTill: 365 },
          { contentId: 2, accessOn: 1, accessTill: 365 }
        ]
      })
    });
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.status).toBe('success');
    expect(body.data).toBeInstanceOf(Array);
    expect(body.data.length).toBe(2);
    expect(body.data[0].contentId).toBe(1);
    expect(body.data[1].contentId).toBe(2);
    expect(body.data[1].order).toBeGreaterThan(body.data[0].order); // Preserved sequential order
  });
});
