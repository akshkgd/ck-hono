import { z } from 'zod';

export const enrollmentTypeSchema = z.enum(['oneTime', 'Subscription', 'free']);
export const paymentStatusSchema = z.enum(['captured', 'failed', 'created', 'refunded']);
export const subscriptionStatusSchema = z.enum(['active', 'expired', 'pending']);

export const createEnrollmentSchema = z.object({
  userId: z.string().uuid(),
  batchId: z.number().int().positive(),
  amountPayable: z.number().int().nonnegative().optional().nullable(),
  enrollmentType: enrollmentTypeSchema.default('oneTime'),
  status: z.number().int().min(0).max(4).default(0),
  progress: z.number().int().min(0).max(100).default(0),
  timeSpentSeconds: z.number().int().nonnegative().default(0),
  amountPaid: z.number().int().nonnegative().optional().nullable(),
  certificateFee: z.number().int().nonnegative().optional().nullable(),
  paymentStatus: paymentStatusSchema.default('created'),
  paymentMethod: z.string().max(50).optional().nullable(),
  couponCode: z.string().max(100).optional().nullable(),
  transactionId: z.string().max(255).optional().nullable(),
  invoiceId: z.string().max(255).optional().nullable(),
  subscriptionId: z.string().max(255).optional().nullable(),
  subscriptionStatus: subscriptionStatusSchema.optional().nullable(),
  subscriptionActiveOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD').optional().nullable(),
  subscriptionExpiresOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD').optional().nullable(),
  paidAt: z.string().refine((val) => !val || !isNaN(Date.parse(val)), 'Must be valid date/time').optional().nullable(),
  certificateId: z.string().max(255).optional().nullable(),
  certificateGeneratedAt: z.string().refine((val) => !val || !isNaN(Date.parse(val)), 'Must be valid date/time').optional().nullable(),
  startedAt: z.string().refine((val) => !val || !isNaN(Date.parse(val)), 'Must be valid date/time').optional().nullable(),
  accessTill: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD').optional().nullable(),
  overrideAccessDays: z.number().int().nonnegative().optional().nullable(),
  utmSource: z.string().max(100).optional().nullable(),
  utmMedium: z.string().max(100).optional().nullable(),
  utmCampaign: z.string().max(150).optional().nullable(),
  remark: z.string().optional().nullable(),
  metadata: z.record(z.string(), z.any()).default({}),
});

export const updateEnrollmentSchema = createEnrollmentSchema.partial();

export const enrollmentSearchQuerySchema = z.object({
  q: z.string().default(''),
  limit: z.preprocess((val) => parseInt(val as string, 10), z.number().int().min(1).max(50).default(10)),
  page: z.preprocess((val) => parseInt(val as string, 10), z.number().int().min(1).default(1)),
});

export type CreateEnrollmentInput = z.infer<typeof createEnrollmentSchema>;
export type UpdateEnrollmentInput = z.infer<typeof updateEnrollmentSchema>;
export type EnrollmentSearchQueryInput = z.infer<typeof enrollmentSearchQuerySchema>;
