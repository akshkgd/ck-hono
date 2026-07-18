import { db } from '../../db/index.js';
import { batchEnrollments } from '../../db/schema.js';
import { UserRepository } from '../users/user.repository.js';
import { EnrollmentRepository } from '../enrollments/enrollment.repository.js';
import { PaymentRepository } from './payment.repository.js';
import { BatchRepository } from '../batches/batch.repository.js';
import type { CreateRazorpayOrderInput, VerifyRazorpayPaymentInput } from './razorpay.validation.js';
import argon2 from 'argon2';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

export class RazorpayService {
  private userRepository: UserRepository;
  private enrollmentRepository: EnrollmentRepository;
  private paymentRepository: PaymentRepository;
  private batchRepository: BatchRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.enrollmentRepository = new EnrollmentRepository();
    this.paymentRepository = new PaymentRepository();
    this.batchRepository = new BatchRepository();
  }

  /**
   * Helper to perform authenticated HTTP requests to Razorpay API
   */
  private async callRazorpay(endpoint: string, method: 'GET' | 'POST' = 'GET', body?: any) {
    const keyId = process.env.RAZORPAY_KEY_ID?.trim().replace(/^["']|["']$/g, '');
    const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim().replace(/^["']|["']$/g, '');

    if (!keyId || !keySecret) {
      throw new Error('Razorpay API keys are not configured in environment variables');
    }

    const basicAuth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const url = `https://api.razorpay.com/v1${endpoint}`;
    
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${basicAuth}`,
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Razorpay API Error (${response.status}): ${errorText}`);
      }

      return await response.json();
    } catch (err: any) {
      console.error('[Razorpay API Request Failed]', err);
      throw new Error(err.message || 'Razorpay service communication failure');
    }
  }

  /**
   * Create a Razorpay Order
   */
  public async createOrder(input: CreateRazorpayOrderInput, userFromContext: any | null) {
    let userId: string;
    
    if (!userFromContext) {
      // Guest payment flow
      if (!input.email || !input.phone) {
        throw new Error('Email and phone are required for guest checkout');
      }

      const cleanEmail = input.email.toLowerCase().trim();
      let user = await this.userRepository.findByEmail(cleanEmail);

      if (!user) {
        // Auto-create guest user
        const randomPassword = uuidv4();
        const hashedPassword = await argon2.hash(randomPassword);
        user = await this.userRepository.create({
          email: cleanEmail,
          password: hashedPassword,
          name: cleanEmail.split('@')[0],
          mobile: input.phone,
          role: 'student',
          status: 'active',
          emailVerified: false,
        });
      }
      userId = user.id;
    } else {
      userId = userFromContext.id;
    }

    let enrollment: any;
    let amountRupees = 0;

    if (input.paymentType === 'enrollment') {
      const batchId = input.batchId!;
      const batch = await this.batchRepository.findById(batchId);
      if (!batch) {
        throw new Error('Batch not found');
      }

      const price = batch.price;
      if (price === null || price <= 0) {
        throw new Error('This batch price is invalid or not set');
      }

      // Check if user is already enrolled
      const existingEnrollment = await this.enrollmentRepository.findByUserAndBatch(userId, batchId);
      if (existingEnrollment) {
        if (existingEnrollment.paymentStatus === 'captured') {
          throw new Error('You are already enrolled in this course');
        }
        enrollment = existingEnrollment;
      } else {
        // Create new inactive enrollment
        enrollment = await this.enrollmentRepository.create({
          userId,
          batchId,
          amountPayable: price,
          amountPaid: 0,
          enrollmentType: 'oneTime',
          paymentStatus: 'created',
          status: 0,
        });
      }

      amountRupees = enrollment.amountPayable - enrollment.amountPaid;
    } else if (input.paymentType === 'pending_payment') {
      const enrollmentId = input.enrollmentId!;
      enrollment = await this.enrollmentRepository.findById(enrollmentId);
      if (!enrollment) {
        throw new Error('Enrollment not found');
      }

      if (enrollment.paymentStatus === 'captured') {
        throw new Error('Payment already completed for this enrollment');
      }

      amountRupees = enrollment.amountPayable - enrollment.amountPaid;
    } else if (input.paymentType === 'renew') {
      const enrollmentId = input.enrollmentId!;
      enrollment = await this.enrollmentRepository.findById(enrollmentId);
      if (!enrollment) {
        throw new Error('Enrollment not found');
      }

      const batch = await this.batchRepository.findById(enrollment.batchId);
      if (!batch) {
        throw new Error('Batch not found');
      }

      const price = batch.price;
      if (price === null || price <= 0) {
        throw new Error('Batch renewal price is invalid or not set');
      }

      amountRupees = price;
    }

    if (amountRupees <= 0) {
      throw new Error('Invalid payment amount calculated');
    }

    // Call Razorpay API to generate order
    const amountPaise = amountRupees * 100;
    const receipt = `rcpt_${enrollment.id}_${Date.now()}`;
    const notes = {
      enrollmentId: enrollment.id.toString(),
      purpose: input.paymentType,
      userId,
      batchId: enrollment.batchId.toString(),
    };

    const razorpayOrder = await this.callRazorpay('/orders', 'POST', {
      amount: amountPaise,
      currency: 'INR',
      receipt,
      notes,
    });

    // Update enrollment metadata with Razorpay details
    await this.enrollmentRepository.update(enrollment.id, {
      metadata: {
        ...(enrollment.metadata || {}),
        razorpayOrderId: razorpayOrder.id,
        razorpayOrderPurpose: input.paymentType,
        razorpayOrderAmount: amountRupees,
      },
    });

    return {
      keyId: process.env.RAZORPAY_KEY_ID?.trim().replace(/^["']|["']$/g, ''),
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      enrollmentId: enrollment.id,
    };
  }

  /**
   * Verify checkout signature
   */
  public async verifyPayment(input: VerifyRazorpayPaymentInput) {
    const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim().replace(/^["']|["']$/g, '');
    if (!keySecret) {
      throw new Error('Razorpay secret key not configured');
    }

    // Verify signature
    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${input.razorpay_order_id}|${input.razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== input.razorpay_signature) {
      throw new Error('Invalid signature verification failed');
    }

    // Fetch enrollment
    const enrollment = await this.enrollmentRepository.findById(input.enrollmentId);
    if (!enrollment) {
      throw new Error('Enrollment not found');
    }

    // Security check: order ID verification
    const metadataOrderId = enrollment.metadata?.razorpayOrderId;
    if (metadataOrderId !== input.razorpay_order_id) {
      throw new Error('Order ID mismatch or invalid request context');
    }

    // Fetch the payment details from Razorpay to get the actual amount paid and method
    const paymentDetails = await this.callRazorpay(`/payments/${input.razorpay_payment_id}`, 'GET');
    const amountPaise = paymentDetails.amount;
    const paymentMethod = paymentDetails.method || 'Razorpay';
    const purpose = enrollment.metadata?.razorpayOrderPurpose || 'enrollment';

    await this.processSuccessfulPayment(
      enrollment.id,
      input.razorpay_payment_id,
      amountPaise,
      paymentMethod,
      purpose
    );

    return { status: 'success', message: 'Payment successfully verified' };
  }

  /**
   * Common process flow for successful payments (Verify + Webhook)
   */
  public async processSuccessfulPayment(
    enrollmentId: number,
    paymentId: string,
    amountPaise: number,
    paymentMethod: string,
    purpose: string
  ) {
    const existingPayment = await this.paymentRepository.findByTransactionId(paymentId);
    if (existingPayment) {
      return;
    }

    const enrollment = await this.enrollmentRepository.findById(enrollmentId);
    if (!enrollment) {
      throw new Error(`Enrollment ${enrollmentId} not found`);
    }

    const paymentAmountRupees = Math.round(amountPaise / 100);

    await db.transaction(async (tx) => {
      // 1. Log transaction in payments table
      await this.paymentRepository.create({
        batchEnrollmentId: enrollmentId,
        amount: paymentAmountRupees,
        paidAt: new Date(),
        paymentMethod: paymentMethod,
        transactionId: paymentId,
        invoiceId: `inv-rp-${paymentId}`,
        purpose: purpose,
        isGstApplicable: true,
        remarks: `Razorpay payment processed for ${purpose}`,
      }, tx);

      // 2. Recalculate amount paid
      await this.enrollmentRepository.recalculateAmountPaid(enrollmentId, tx);

      // 3. Update status & dates if captured
      const updatedEnrollment = await this.enrollmentRepository.findById(enrollmentId, tx);
      if (updatedEnrollment) {
        const updateData: any = {};
        
        if (updatedEnrollment.paymentStatus === 'captured') {
          updateData.status = 1; // Set Active
          if (!updatedEnrollment.startedAt) {
            updateData.startedAt = new Date();
          }
        }

        if (purpose === 'renew') {
          const now = new Date();
          let currentEnd = updatedEnrollment.accessTill ? new Date(updatedEnrollment.accessTill) : null;
          
          if (!currentEnd) {
            const started = updatedEnrollment.startedAt 
              ? new Date(updatedEnrollment.startedAt) 
              : (updatedEnrollment.paidAt ? new Date(updatedEnrollment.paidAt) : new Date(updatedEnrollment.createdAt));
            currentEnd = new Date(started);
            currentEnd.setFullYear(currentEnd.getFullYear() + 1);
          }

          const baseDate = currentEnd.getTime() > now.getTime() ? currentEnd : now;
          const newAccessTill = new Date(baseDate);
          newAccessTill.setFullYear(newAccessTill.getFullYear() + 1);
          
          updateData.accessTill = newAccessTill;
        }

        if (Object.keys(updateData).length > 0) {
          await this.enrollmentRepository.update(enrollmentId, updateData, tx);
        }
      }
    });
  }

  /**
   * Handle Webhook notifications from Razorpay
   */
  public async handleWebhook(rawBody: string, signature: string) {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET?.trim().replace(/^["']|["']$/g, '');
    if (!webhookSecret) {
      throw new Error('Razorpay webhook secret not configured');
    }

    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      throw new Error('Invalid webhook signature');
    }

    const event = JSON.parse(rawBody);

    if (event.event === 'payment.captured') {
      const payment = event.payload.payment.entity;
      const notes = payment.notes || {};
      const enrollmentId = Number(notes.enrollmentId);
      
      if (!enrollmentId || isNaN(enrollmentId)) {
        console.warn('[Razorpay Webhook] Received payment captured event without valid enrollmentId:', notes);
        return { status: 'ignored', reason: 'No enrollment ID in notes' };
      }

      const paymentId = payment.id;
      const amountPaise = payment.amount;
      const paymentMethod = payment.method || 'Razorpay';
      const purpose = notes.purpose || 'enrollment';

      await this.processSuccessfulPayment(
        enrollmentId,
        paymentId,
        amountPaise,
        paymentMethod,
        purpose
      );

      return { status: 'success' };
    }

    return { status: 'ignored', reason: 'Unhandled event type' };
  }
}
