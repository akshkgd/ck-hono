import { z } from 'zod';

export const paymentPurposeSchema = z.enum(['enrollment', 'renewal', 'certificate', 'upgrade', 'refund']);

export const createPaymentSchema = z.object({
  batchEnrollmentId: z.string(),
  amount: z.number().int(),
  paidAt: z.string().refine((val) => !val || !isNaN(Date.parse(val)), 'Must be valid date/time').optional().nullable(),
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
  batchEnrollmentId: z.string().optional(),
  limit: z.preprocess((val) => val ? parseInt(val as string, 10) : undefined, z.number().int().min(1).max(50).default(10)),
  page: z.preprocess((val) => val ? parseInt(val as string, 10) : undefined, z.number().int().min(1).default(1)),
});

export const transactionSearchQuerySchema = z.object({
  q: z.string().optional().default(''),
  timeRange: z.enum([
    'today',
    'yesterday',
    'this_week',
    'last_week',
    'this_month',
    'last_month',
    'custom'
  ]).optional().default('this_month'),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD').optional().nullable(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD').optional().nullable(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  page: z.preprocess((val) => val ? parseInt(val as string, 10) : undefined, z.number().int().min(1).default(1)),
  limit: z.preprocess((val) => val ? parseInt(val as string, 10) : undefined, z.number().int().min(1).max(100).default(20)),
}).refine((data) => {
  if (data.timeRange === 'custom') {
    return !!data.startDate && !!data.endDate;
  }
  return true;
}, {
  message: 'startDate and endDate are required when timeRange is set to custom',
  path: ['startDate']
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type UpdatePaymentInput = z.infer<typeof updatePaymentSchema>;
export type PaymentSearchQueryInput = z.infer<typeof paymentSearchQuerySchema>;
export type TransactionSearchQueryInput = z.infer<typeof transactionSearchQuerySchema>;
