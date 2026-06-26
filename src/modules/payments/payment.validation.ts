import { z } from 'zod';

export const paymentPurposeSchema = z.enum(['enrollment', 'renewal', 'certificate', 'upgrade', 'refund']);

export const createPaymentSchema = z.object({
  batchEnrollmentId: z.number().int().positive(),
  amount: z.number().int(),
  paidAt: z.string().refine((val) => !val || !isNaN(Date.parse(val)), 'Must be valid date/time'),
  paymentMethod: z.string().max(100).optional().nullable(),
  transactionId: z.string().max(255).optional().nullable(),
  invoiceId: z.string().max(255).optional().nullable(),
  purpose: paymentPurposeSchema.default('enrollment'),
  isGstApplicable: z.boolean().default(true),
  remarks: z.string().optional().nullable(),
  metadata: z.record(z.string(), z.any()).default({}),
});

export const updatePaymentSchema = createPaymentSchema.partial();

export const paymentSearchQuerySchema = z.object({
  q: z.string().default(''),
  limit: z.preprocess((val) => parseInt(val as string, 10), z.number().int().min(1).max(50).default(10)),
  page: z.preprocess((val) => parseInt(val as string, 10), z.number().int().min(1).default(1)),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type UpdatePaymentInput = z.infer<typeof updatePaymentSchema>;
export type PaymentSearchQueryInput = z.infer<typeof paymentSearchQuerySchema>;
