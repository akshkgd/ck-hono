import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import app from '../../app.js';
import { db } from '../../db/index.js';
import { batches, users, batchEnrollments, batchEnrollmentPayments } from '../../db/schema.js';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('Razorpay Payments Module', () => {
  let testBatchId: number;
  let jwtToken = '';
  let guestEmail = `guest.${Date.now()}@example.com`;
  let studentEmail = `student.${Date.now()}@example.com`;
  let studentUserId = '';
  
  const keyId = 'rzp_test_mockKeyId';
  const keySecret = 'mockKeySecret';
  const webhookSecret = 'mockWebhookSecret';

  beforeAll(async () => {
    // Set up test credentials
    process.env.RAZORPAY_KEY_ID = keyId;
    process.env.RAZORPAY_KEY_SECRET = keySecret;
    process.env.RAZORPAY_WEBHOOK_SECRET = webhookSecret;
    process.env.JWT_SECRET = 'test-jwt-secret';

    // 1. Create a test batch
    const newBatches = await db.insert(batches).values({
      name: 'Razorpay Testing Cohort',
      price: 4999,
      type: 'cohort',
      status: 'active',
      startDate: '2026-07-18',
      endDate: '2027-07-18',
    }).returning();
    
    testBatchId = newBatches[0].id;

    // 2. Register/login a student to test authenticated checkout
    const regRes = await app.request('/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: studentEmail,
        password: 'Password123!',
        name: 'Auth Student',
      }),
    });

    const body = await regRes.json();
    jwtToken = body.data.token;
    studentUserId = body.data.user.id;
  });

  afterAll(async () => {
    // Cleanup created batch and student
    if (testBatchId) {
      await db.delete(batches).where(eq(batches.id, testBatchId));
    }
    if (studentUserId) {
      await db.delete(users).where(eq(users.id, studentUserId));
    }
    // Delete any guest users created during the tests
    await db.delete(users).where(eq(users.email, guestEmail));
  });

  describe('POST /v1/payments/razorpay/create-order', () => {
    it('should fail if paymentType is enrollment but batchId is missing', async () => {
      const res = await app.request('/v1/payments/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentType: 'enrollment',
        }),
      });

      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.status).toBe('error');
    });

    it('should fail for guest user if email/phone is missing', async () => {
      const res = await app.request('/v1/payments/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentType: 'enrollment',
          batchId: testBatchId,
        }),
      });

      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.message).toContain('required for guest checkout');
    });

    it('should successfully create order, user, and enrollment for a guest', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 'order_mock_guest123',
          entity: 'order',
          amount: 499900,
          currency: 'INR',
          status: 'created',
        }),
      });

      const res = await app.request('/v1/payments/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentType: 'enrollment',
          batchId: testBatchId,
          email: guestEmail,
          phone: '9999999999',
          name: 'Guest Programmer',
        }),
      });

      expect(res.status).toBe(201);
      const body = await res.json();
      expect(body.status).toBe('success');
      expect(body.data.orderId).toBe('order_mock_guest123');
      expect(body.data.amount).toBe(499900);

      // Verify guest user was created in DB
      const guestUser = await db
        .select()
        .from(users)
        .where(eq(users.email, guestEmail))
        .limit(1)
        .then((res) => res[0] || null);
      expect(guestUser).toBeDefined();
      expect(guestUser?.mobile).toBe('9999999999');
      expect(guestUser?.name).toBe('Guest Programmer');

      // Verify enrollment was created in created status
      const guestEnrollment = await db
        .select()
        .from(batchEnrollments)
        .where(eq(batchEnrollments.userId, guestUser!.id))
        .limit(1)
        .then((res) => res[0] || null);
      expect(guestEnrollment).toBeDefined();
      expect(guestEnrollment?.paymentStatus).toBe('created');
      expect(guestEnrollment?.metadata).toHaveProperty('razorpayOrderId', 'order_mock_guest123');

      // Clean up enrollment for guest user to prevent constraint violations later
      await db.delete(batchEnrollments).where(eq(batchEnrollments.id, guestEnrollment!.id));
    });

    it('should successfully create order and enrollment for an authenticated student', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 'order_mock_auth123',
          entity: 'order',
          amount: 499900,
          currency: 'INR',
          status: 'created',
        }),
      });

      const res = await app.request('/v1/payments/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `token=${jwtToken}`,
        },
        body: JSON.stringify({
          paymentType: 'enrollment',
          batchId: testBatchId,
        }),
      });

      expect(res.status).toBe(201);
      const body = await res.json();
      expect(body.status).toBe('success');
      expect(body.data.orderId).toBe('order_mock_auth123');
      expect(body.data.enrollmentId).toBeDefined();

      const enrollment = await db
        .select()
        .from(batchEnrollments)
        .where(eq(batchEnrollments.userId, studentUserId))
        .limit(1)
        .then((res) => res[0] || null);
      expect(enrollment).toBeDefined();
      expect(enrollment?.metadata).toHaveProperty('razorpayOrderId', 'order_mock_auth123');
    });
  });

  describe('POST /v1/payments/razorpay/verify', () => {
    it('should fail with invalid signature', async () => {
      const studentEnrollment = await db
        .select()
        .from(batchEnrollments)
        .where(eq(batchEnrollments.userId, studentUserId))
        .limit(1)
        .then((res) => res[0] || null);
      expect(studentEnrollment).toBeDefined();

      const res = await app.request('/v1/payments/razorpay/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enrollmentId: studentEnrollment!.id,
          razorpay_payment_id: 'pay_invalid123',
          razorpay_order_id: 'order_mock_auth123',
          razorpay_signature: 'invalid_sig',
        }),
      });

      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.message).toContain('verification failed');
    });

    it('should successfully verify payment, activate enrollment, and log payment details', async () => {
      const studentEnrollment = await db
        .select()
        .from(batchEnrollments)
        .where(eq(batchEnrollments.userId, studentUserId))
        .limit(1)
        .then((res) => res[0] || null);
      expect(studentEnrollment).toBeDefined();

      const paymentId = 'pay_mock_auth123';
      const orderId = 'order_mock_auth123';
      
      // Calculate valid HMAC SHA256 signature
      const hmac = crypto.createHmac('sha256', keySecret);
      hmac.update(`${orderId}|${paymentId}`);
      const validSignature = hmac.digest('hex');

      // Mock the getPayment API call in the verification flow
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: paymentId,
          amount: 499900,
          method: 'upi',
          status: 'captured',
        }),
      });

      const res = await app.request('/v1/payments/razorpay/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enrollmentId: studentEnrollment!.id,
          razorpay_payment_id: paymentId,
          razorpay_order_id: orderId,
          razorpay_signature: validSignature,
        }),
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.status).toBe('success');

      // Verify DB updates
      const updatedEnrollment = await db
        .select()
        .from(batchEnrollments)
        .where(eq(batchEnrollments.id, studentEnrollment!.id))
        .limit(1)
        .then((res) => res[0] || null);
      expect(updatedEnrollment?.paymentStatus).toBe('captured');
      expect(updatedEnrollment?.status).toBe(1); // Activated
      expect(updatedEnrollment?.startedAt).not.toBeNull();

      const loggedPayment = await db
        .select()
        .from(batchEnrollmentPayments)
        .where(eq(batchEnrollmentPayments.batchEnrollmentId, studentEnrollment!.id))
        .limit(1)
        .then((res) => res[0] || null);
      expect(loggedPayment).toBeDefined();
      expect(loggedPayment?.amount).toBe(4999);
      expect(loggedPayment?.transactionId).toBe(paymentId);
      expect(loggedPayment?.purpose).toBe('enrollment');
    });
  });

  describe('POST /v1/payments/razorpay/webhook', () => {
    it('should successfully handle webhook captured event, renew access and extend date by 1 year', async () => {
      const studentEnrollment = await db
        .select()
        .from(batchEnrollments)
        .where(eq(batchEnrollments.userId, studentUserId))
        .limit(1)
        .then((res) => res[0] || null);
      expect(studentEnrollment).toBeDefined();

      const webhookPaymentId = 'pay_webhook_renew123';
      const webhookPayload = JSON.stringify({
        event: 'payment.captured',
        payload: {
          payment: {
            entity: {
              id: webhookPaymentId,
              amount: 499900,
              method: 'card',
              notes: {
                enrollmentId: studentEnrollment!.id.toString(),
                purpose: 'renew',
              },
            },
          },
        },
      });

      const webhookSig = crypto
        .createHmac('sha256', webhookSecret)
        .update(webhookPayload)
        .digest('hex');

      const res = await app.request('/v1/payments/razorpay/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Razorpay-Signature': webhookSig,
        },
        body: webhookPayload,
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.status).toBe('success');

      // Verify DB updates for renewal
      const renewedEnrollment = await db
        .select()
        .from(batchEnrollments)
        .where(eq(batchEnrollments.id, studentEnrollment!.id))
        .limit(1)
        .then((res) => res[0] || null);
      expect(renewedEnrollment?.accessTill).not.toBeNull();
      
      const renewPayment = await db
        .select()
        .from(batchEnrollmentPayments)
        .where(eq(batchEnrollmentPayments.transactionId, webhookPaymentId))
        .limit(1)
        .then((res) => res[0] || null);
      expect(renewPayment).toBeDefined();
      expect(renewPayment?.purpose).toBe('renew');
      expect(renewPayment?.amount).toBe(4999);

      // Cleanup payments and enrollment at the end
      await db.delete(batchEnrollmentPayments).where(eq(batchEnrollmentPayments.batchEnrollmentId, studentEnrollment!.id));
      await db.delete(batchEnrollments).where(eq(batchEnrollments.id, studentEnrollment!.id));
    });
  });
});
