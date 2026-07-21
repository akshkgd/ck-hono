import { z } from 'zod';

export const createRazorpayOrderSchema = z.object({
  paymentType: z.enum(['enrollment', 'pending_payment', 'renew']).default('enrollment'),
  batchId: z.string().optional(),
  enrollmentId: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().min(10).max(15).optional(),
  name: z.string().max(255).optional(),
}).refine((data) => {
  if (data.paymentType === 'enrollment') {
    return data.batchId !== undefined && data.batchId.length > 0;
  }
  return true;
}, {
  message: 'batchId is required when paymentType is enrollment',
  path: ['batchId'],
}).refine((data) => {
  if (data.paymentType === 'pending_payment' || data.paymentType === 'renew') {
    return data.enrollmentId !== undefined && data.enrollmentId.length > 0;
  }
  return true;
}, {
  message: 'enrollmentId is required when paymentType is pending_payment or renew',
  path: ['enrollmentId'],
});

export const verifyRazorpayPaymentSchema = z.object({
  enrollmentId: z.string(),
  razorpay_payment_id: z.string().min(1),
  razorpay_order_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

export type CreateRazorpayOrderInput = z.infer<typeof createRazorpayOrderSchema>;
export type VerifyRazorpayPaymentInput = z.infer<typeof verifyRazorpayPaymentSchema>;
