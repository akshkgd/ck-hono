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

  describe('Query Filtering & Calculation Sync Operations', () => {
    let secondEnrollmentId: number;

    beforeAll(async () => {
      // Create a second test enrollment to verify filtering
      const enrollmentRes = await app.request('/v1/admin/enrollments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          userId: targetUserId,
          batchId: testBatchId,
          amountPayable: 500,
          enrollmentType: 'oneTime',
          status: 0,
        })
      });
      if (enrollmentRes.status === 201) {
        const body = await enrollmentRes.json();
        secondEnrollmentId = body.data.id;
      }
    });

    it('should filter payments by batchEnrollmentId query parameter', async () => {
      // 1. Record a payment for first enrollment (testEnrollmentId)
      const pay1Res = await app.request('/v1/admin/enrollment-payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          batchEnrollmentId: testEnrollmentId,
          amount: 399,
          paidAt: new Date().toISOString(),
          purpose: 'enrollment'
        })
      });
      expect(pay1Res.status).toBe(201);
      const pay1Body = await pay1Res.json();
      const pay1Id = pay1Body.data.id;

      // 2. Record a payment for second enrollment (secondEnrollmentId)
      const pay2Res = await app.request('/v1/admin/enrollment-payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          batchEnrollmentId: secondEnrollmentId,
          amount: 250,
          paidAt: new Date().toISOString(),
          purpose: 'enrollment'
        })
      });
      expect(pay2Res.status).toBe(201);
      const pay2Body = await pay2Res.json();
      const pay2Id = pay2Body.data.id;

      // 3. Search payments filtering by secondEnrollmentId
      const filterRes = await app.request(`/v1/admin/enrollment-payments?batchEnrollmentId=${secondEnrollmentId}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      expect(filterRes.status).toBe(200);
      const filterBody = await filterRes.json();
      expect(filterBody.status).toBe('success');
      expect(filterBody.data.payments.length).toBe(1);
      expect(filterBody.data.payments[0].batchEnrollmentId).toBe(secondEnrollmentId);

      // Clean up recorded payments
      await app.request(`/v1/admin/enrollment-payments/${pay1Id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${adminToken}` } });
      await app.request(`/v1/admin/enrollment-payments/${pay2Id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${adminToken}` } });
    });

    it('should automatically sync and calculate amountPaid and paymentStatus on the enrollment', async () => {
      // 1. Initial State Check
      const initEnrollmentRes = await app.request(`/v1/admin/enrollments/${secondEnrollmentId}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      expect(initEnrollmentRes.status).toBe(200);
      const initEnrollmentBody = await initEnrollmentRes.json();
      expect(initEnrollmentBody.data.amountPaid).toBe(0);
      expect(initEnrollmentBody.data.paymentStatus).toBe('created');

      // 2. Partial Payment Check
      const pay1Res = await app.request('/v1/admin/enrollment-payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          batchEnrollmentId: secondEnrollmentId,
          amount: 200,
          paidAt: new Date().toISOString(),
          purpose: 'enrollment'
        })
      });
      expect(pay1Res.status).toBe(201);
      const pay1Body = await pay1Res.json();
      const pay1Id = pay1Body.data.id;

      const partialEnrollmentRes = await app.request(`/v1/admin/enrollments/${secondEnrollmentId}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      const partialEnrollmentBody = await partialEnrollmentRes.json();
      expect(partialEnrollmentBody.data.amountPaid).toBe(200);
      expect(partialEnrollmentBody.data.paymentStatus).toBe('created');

      // 3. Full Payment Check (Captured)
      const pay2Res = await app.request('/v1/admin/enrollment-payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          batchEnrollmentId: secondEnrollmentId,
          amount: 300,
          paidAt: new Date().toISOString(),
          purpose: 'enrollment'
        })
      });
      expect(pay2Res.status).toBe(201);
      const pay2Body = await pay2Res.json();
      const pay2Id = pay2Body.data.id;

      const fullEnrollmentRes = await app.request(`/v1/admin/enrollments/${secondEnrollmentId}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      const fullEnrollmentBody = await fullEnrollmentRes.json();
      expect(fullEnrollmentBody.data.amountPaid).toBe(500);
      expect(fullEnrollmentBody.data.paymentStatus).toBe('captured');

      // 4. Refund Payment Check (Refunded)
      const refundRes = await app.request('/v1/admin/enrollment-payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          batchEnrollmentId: secondEnrollmentId,
          amount: 500,
          paidAt: new Date().toISOString(),
          purpose: 'refund'
        })
      });
      expect(refundRes.status).toBe(201);
      const refundBody = await refundRes.json();
      const refundId = refundBody.data.id;

      const refundEnrollmentRes = await app.request(`/v1/admin/enrollments/${secondEnrollmentId}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      const refundEnrollmentBody = await refundEnrollmentRes.json();
      expect(refundEnrollmentBody.data.amountPaid).toBe(0);
      expect(refundEnrollmentBody.data.paymentStatus).toBe('refunded');

      // Clean up recorded payments
      await app.request(`/v1/admin/enrollment-payments/${pay1Id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${adminToken}` } });
      await app.request(`/v1/admin/enrollment-payments/${pay2Id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${adminToken}` } });
      await app.request(`/v1/admin/enrollment-payments/${refundId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${adminToken}` } });
    });
  });
});

