import { describe, it, expect, beforeAll } from 'vitest';
import app from '../../../app.js';

describe('Admin Enrollments CRUD Module', () => {
  let adminToken = '';
  let userToken = '';
  let targetUserId = '';
  let testBatchId: number;
  let createdEnrollmentId: number;

  const testBatchData = {
    name: 'TypeScript for Enrollments Test',
    topic: 'Testing',
    slug: `test-enrollments-batch-${Date.now()}`,
    price: 299,
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
      // Get the admin's user ID for reference
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

    // 3. Create a test batch using the Admin API
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
  });

  describe('Access Control Checks', () => {
    it('should reject unauthenticated requests with 401 Unauthorized', async () => {
      const res = await app.request('/v1/admin/enrollments', { method: 'GET' });
      expect(res.status).toBe(401);
    });

    it('should reject standard user requests with 403 Forbidden', async () => {
      const res = await app.request('/v1/admin/enrollments', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${userToken}` }
      });
      expect(res.status).toBe(403);
    });
  });

  describe('CRUD Operations', () => {
    it('should allow admin to manually enroll a user in a batch', async () => {
      expect(adminToken).toBeTruthy();
      expect(targetUserId).toBeTruthy();
      expect(testBatchId).toBeTypeOf('number');

      const res = await app.request('/v1/admin/enrollments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          userId: targetUserId,
          batchId: testBatchId,
          amountPayable: 499,
          enrollmentType: 'oneTime',
          status: 0, // Inactive by default
          progress: 0,
          amountPaid: 299,
          paymentStatus: 'created',
          remark: 'Manual admin seed'
        })
      });

      expect(res.status).toBe(201);
      const body = await res.json();
      expect(body.status).toBe('success');
      expect(body.data.userId).toBe(targetUserId);
      expect(body.data.batchId).toBe(testBatchId);
      expect(body.data.amountPayable).toBe(499);
      expect(body.data.amountPaid).toBe(299);
      expect(body.data.remark).toBe('Manual admin seed');

      createdEnrollmentId = body.data.id;
      expect(createdEnrollmentId).toBeTypeOf('number');
    });

    it('should reject enrolling with non-existent user or batch', async () => {
      const fakeUserRes = await app.request('/v1/admin/enrollments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          userId: '00000000-0000-0000-0000-000000000000',
          batchId: testBatchId,
        })
      });
      expect(fakeUserRes.status).toBe(400);
      const fakeUserBody = await fakeUserRes.json();
      expect(fakeUserBody.message).toContain('User not found');

      const fakeBatchRes = await app.request('/v1/admin/enrollments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          userId: targetUserId,
          batchId: 999999,
        })
      });
      expect(fakeBatchRes.status).toBe(400);
      const fakeBatchBody = await fakeBatchRes.json();
      expect(fakeBatchBody.message).toContain('Batch not found');
    });

    it('should allow admin to list/search enrollments', async () => {
      const res = await app.request('/v1/admin/enrollments?limit=10&page=1', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.status).toBe('success');
      expect(body.data.enrollments).toBeInstanceOf(Array);
      expect(body.data.enrollments.length).toBeGreaterThan(0);
      expect(body.data.enrollments[0].amountPaid).toBeDefined();
      expect(body.data.enrollments[0].paidAt).toBeDefined();
      expect(body.data.pagination.total).toBeGreaterThan(0);
    });

    it('should allow admin to fetch enrollment details with user and batch info', async () => {
      const res = await app.request(`/v1/admin/enrollments/${createdEnrollmentId}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.status).toBe('success');
      expect(body.data.id).toBe(createdEnrollmentId);
      expect(body.data.user).toBeDefined();
      expect(body.data.batch).toBeDefined();
      expect(body.data.user.email).toBe('aarav.sharma0@example.com');
      expect(body.data.batch.name).toBe(testBatchData.name);
      expect(body.data).toHaveProperty('sequentialLearning');
      expect(body.data).toHaveProperty('sequentialLearningWithAssignments');
    });

    it('should allow admin to update enrollment properties', async () => {
      const res = await app.request(`/v1/admin/enrollments/${createdEnrollmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          status: 1, // Active
          progress: 50,
          paymentStatus: 'captured',
          certificateId: 'cert-test-id-123',
          sequentialLearning: true,
          sequentialLearningWithAssignments: true
        })
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.status).toBe('success');
      expect(body.data.status).toBe(1);
      expect(body.data.progress).toBe(50);
      expect(body.data.paymentStatus).toBe('captured');
      expect(body.data.certificateId).toBe('cert-test-id-123');
      expect(body.data.sequentialLearning).toBe(true);
      expect(body.data.sequentialLearningWithAssignments).toBe(true);
    });

    it('should allow admin to delete an enrollment record', async () => {
      const res = await app.request(`/v1/admin/enrollments/${createdEnrollmentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.status).toBe('success');
      expect(body.message).toContain('deleted');

      // Verify deletion
      const checkRes = await app.request(`/v1/admin/enrollments/${createdEnrollmentId}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      expect(checkRes.status).toBe(400);
      const checkBody = await checkRes.json();
      expect(checkBody.message).toContain('not found');
    });

    it('should automatically log transaction ledger entries when creating or updating enrollment with amountPaid', async () => {
      // 1. Create enrollment with amountPaid = 350
      const createRes = await app.request('/v1/admin/enrollments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          userId: targetUserId,
          batchId: testBatchId,
          amountPayable: 500,
          amountPaid: 350,
          enrollmentType: 'oneTime',
          status: 0,
        })
      });
      expect(createRes.status).toBe(201);
      const createBody = await createRes.json();
      const localEnrollmentId = createBody.data.id;
      expect(createBody.data.amountPaid).toBe(350);

      // Verify a corresponding payment record was logged
      const getPaymentsRes = await app.request(`/v1/admin/enrollment-payments?batchEnrollmentId=${localEnrollmentId}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      expect(getPaymentsRes.status).toBe(200);
      const getPaymentsBody = await getPaymentsRes.json();
      expect(getPaymentsBody.data.payments.length).toBe(1);
      expect(getPaymentsBody.data.payments[0].amount).toBe(350);

      // 2. Update enrollment directly, setting amountPaid = 500 (+150 diff)
      const updateRes = await app.request(`/v1/admin/enrollments/${localEnrollmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          amountPaid: 500
        })
      });
      expect(updateRes.status).toBe(200);
      const updateBody = await updateRes.json();
      expect(updateBody.data.amountPaid).toBe(500);
      expect(updateBody.data.paymentStatus).toBe('captured');

      // Verify that a second transaction was added to the payments table (totaling 2 payments)
      const getPayments2Res = await app.request(`/v1/admin/enrollment-payments?batchEnrollmentId=${localEnrollmentId}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      expect(getPayments2Res.status).toBe(200);
      const getPayments2Body = await getPayments2Res.json();
      expect(getPayments2Body.data.payments.length).toBe(2);

      // Clean up enrollment
      await app.request(`/v1/admin/enrollments/${localEnrollmentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
    });
  });
});

