import { describe, it, expect, beforeAll } from 'vitest';
import app from '../../../app.js';

describe('Admin Payments CRUD Module', () => {
  let adminToken = '';
  let userToken = '';
  let targetUserId = '';
  let testBatchId: number;
  let testEnrollmentId: number;
  let createdPaymentId: number;

  const testBatchData = {
    name: 'TypeScript for Payments Test',
    topic: 'Testing',
    slug: `test-payments-batch-${Date.now()}`,
    price: 399,
    startDate: '2026-07-01',
    endDate: '2026-08-01',
    type: 'cohort',
    status: 'private',
  };

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
      targetUserId = body.data.user.id;
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

    // 3. Create a test batch
    const batchRes = await app.request('/v1/admin/batches', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify(testBatchData)
    });
    if (batchRes.status === 201) {
      const body = await batchRes.json();
      testBatchId = body.data.id;
    }

    // 4. Create a test enrollment
    const enrollmentRes = await app.request('/v1/admin/enrollments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        userId: targetUserId,
        batchId: testBatchId,
        amountPayable: 399,
        enrollmentType: 'oneTime',
        status: 0,
      })
    });
    if (enrollmentRes.status === 201) {
      const body = await enrollmentRes.json();
      testEnrollmentId = body.data.id;
    }
  });

  describe('Access Control Checks', () => {
    it('should reject unauthenticated requests with 401 Unauthorized', async () => {
      const res = await app.request('/v1/admin/enrollment-payments', { method: 'GET' });
      expect(res.status).toBe(401);
    });

    it('should reject standard user requests with 403 Forbidden', async () => {
      const res = await app.request('/v1/admin/enrollment-payments', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${userToken}` }
      });
      expect(res.status).toBe(403);
    });
  });

  describe('CRUD Operations', () => {
    it('should allow admin to record a new payment', async () => {
      expect(adminToken).toBeTruthy();
      expect(testEnrollmentId).toBeTypeOf('number');

      const res = await app.request('/v1/admin/enrollment-payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          batchEnrollmentId: testEnrollmentId,
          amount: 399,
          paidAt: new Date().toISOString(),
          paymentMethod: 'UPI',
          transactionId: `tx-${Date.now()}`,
          invoiceId: `inv-${Date.now()}`,
          purpose: 'enrollment',
          isGstApplicable: true,
          remarks: 'Recorded via Vitest integration'
        })
      });

      expect(res.status).toBe(201);
      const body = await res.json();
      expect(body.status).toBe('success');
      expect(body.data.batchEnrollmentId).toBe(testEnrollmentId);
      expect(body.data.amount).toBe(399);
      expect(body.data.paymentMethod).toBe('UPI');

      createdPaymentId = body.data.id;
      expect(createdPaymentId).toBeTypeOf('number');
    });

    it('should reject recording a payment for a non-existent enrollment', async () => {
      const res = await app.request('/v1/admin/enrollment-payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          batchEnrollmentId: 999999,
          amount: 399,
          paidAt: new Date().toISOString()
        })
      });

      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.message).toContain('enrollment not found');
    });

    it('should allow admin to list/search payments', async () => {
      const res = await app.request('/v1/admin/enrollment-payments?limit=10&page=1', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.status).toBe('success');
      expect(body.data.payments).toBeInstanceOf(Array);
      expect(body.data.payments.length).toBeGreaterThan(0);
      expect(body.data.pagination.total).toBeGreaterThan(0);
    });

    it('should allow admin to fetch payment details with joined tables', async () => {
      const res = await app.request(`/v1/admin/enrollment-payments/${createdPaymentId}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.status).toBe('success');
      expect(body.data.id).toBe(createdPaymentId);
      expect(body.data.enrollment).toBeDefined();
      expect(body.data.user).toBeDefined();
      expect(body.data.batch).toBeDefined();
      expect(body.data.user.email).toBe('aarav.sharma0@example.com');
      expect(body.data.batch.name).toBe(testBatchData.name);
    });

    it('should allow admin to update payment properties', async () => {
      const res = await app.request(`/v1/admin/enrollment-payments/${createdPaymentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          amount: 450,
          paymentMethod: 'Card',
          remarks: 'Updated remark details'
        })
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.status).toBe('success');
      expect(body.data.amount).toBe(450);
      expect(body.data.paymentMethod).toBe('Card');
      expect(body.data.remarks).toBe('Updated remark details');
    });

    it('should allow admin to delete a payment record', async () => {
      const res = await app.request(`/v1/admin/enrollment-payments/${createdPaymentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.status).toBe('success');
      expect(body.message).toContain('deleted');

      // Verify deletion
      const checkRes = await app.request(`/v1/admin/enrollment-payments/${createdPaymentId}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      expect(checkRes.status).toBe(400);
      const checkBody = await checkRes.json();
      expect(checkBody.message).toContain('not found');
    });
  });
});
