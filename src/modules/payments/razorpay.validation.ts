import { z } from 'zod';

export const createRazorpayOrderSchema = z.object({
  paymentType: z.enum(['enrollment', 'pending_payment', 'renew']),
  batchId: z.number().int().positive().optional(),
  enrollmentId: z.number().int().positive().optional(),
  email: z.string().email().optional(),
  phone: z.string().min(10).max(15).optional(),
  name: z.string().max(255).optional(),
}).refine((data) => {
  if (data.paymentType === 'enrollment') {
    return data.batchId !== undefined;
  }
  return true;
}, {
  message: 'batchId is required when paymentType is enrollment',
  path: ['batchId'],
}).refine((data) => {
  if (data.paymentType === 'pending_payment' || data.paymentType === 'renew') {
    return data.enrollmentId !== undefined;
  }
  return true;
}, {
  message: 'enrollmentId is required when paymentType is pending_payment or renew',
  path: ['enrollmentId'],
});

export const verifyRazorpayPaymentSchema = z.object({
  enrollmentId: z.number().int().positive(),
  razorpay_payment_id: z.string().min(1),
  razorpay_order_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

export type CreateRazorpayOrderInput = z.infer<typeof createRazorpayOrderSchema>;
export type VerifyRazorpayPaymentInput = z.infer<typeof verifyRazorpayPaymentSchema>;
