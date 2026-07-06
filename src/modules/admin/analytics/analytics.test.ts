import { describe, it, expect, beforeAll } from 'vitest';
import app from '../../../app.js';

describe('Admin Analytics Module', () => {
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

  describe('Access Control', () => {
    it('should reject unauthenticated request with 401 on GET /v1/admin/analytics/overview', async () => {
      const res = await app.request('/v1/admin/analytics/overview', { method: 'GET' });
      expect(res.status).toBe(401);
    });

    it('should reject standard user request with 403 on GET /v1/admin/analytics/overview', async () => {
      const res = await app.request('/v1/admin/analytics/overview', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${userToken}` }
      });
      expect(res.status).toBe(403);
    });

    it('should reject unauthenticated request with 401 on GET /v1/admin/analytics/db-stats', async () => {
      const res = await app.request('/v1/admin/analytics/db-stats', { method: 'GET' });
      expect(res.status).toBe(401);
    });

    it('should reject standard user request with 403 on GET /v1/admin/analytics/db-stats', async () => {
      const res = await app.request('/v1/admin/analytics/db-stats', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${userToken}` }
      });
      expect(res.status).toBe(403);
    });
  });

  describe('Endpoints Functionality', () => {
    it('should allow admin to fetch overview stats', async () => {
      const res = await app.request('/v1/admin/analytics/overview?range=last_30_days&limit=10&page=1', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.status).toBe('success');
      expect(body.data.metrics).toBeDefined();
      expect(body.data.list).toBeInstanceOf(Array);
    });

    it('should allow admin to fetch database stats with table sizes and row counts', async () => {
      const res = await app.request('/v1/admin/analytics/db-stats', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.status).toBe('success');
      expect(body.data).toBeInstanceOf(Array);
      expect(body.data.length).toBeGreaterThan(0);

      // Verify stats object structure of the first table
      const firstTable = body.data[0];
      expect(firstTable.tableName).toBeTypeOf('string');
      expect(firstTable.totalSizeBytes).toBeTypeOf('number');
      expect(firstTable.totalSizePretty).toBeTypeOf('string');
      expect(firstTable.tableSizeBytes).toBeTypeOf('number');
      expect(firstTable.tableSizePretty).toBeTypeOf('string');
      expect(firstTable.indexSizeBytes).toBeTypeOf('number');
      expect(firstTable.indexSizePretty).toBeTypeOf('string');
      expect(firstTable.rowCount).toBeTypeOf('number');

      // Check if critical tables exist in the stats output
      const tableNames = body.data.map((t: any) => t.tableName);
      expect(tableNames).toContain('users');
      expect(tableNames).toContain('batches');
      expect(tableNames).toContain('batch_enrollments');
      expect(tableNames).toContain('batch_enrollment_payments');
    });
  });
});
