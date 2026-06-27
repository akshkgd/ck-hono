import { z } from 'zod';

export const batchTypeEnumSchema = z.enum(['cohort', 'live', 'webinar', 'callBooking', 'mentorship']);
export const batchStatusEnumSchema = z.enum(['active', 'private', 'completed']);

export const createBatchSchema = z.object({
  topic: z.string().max(255).optional().nullable(),
  name: z.string().min(1).max(255),
  description: z.string().max(255).optional().nullable(),
  slug: z.string().max(255).optional().nullable(),
  price: z.number().int().nonnegative().optional().nullable(),
  certificateFee: z.number().int().nonnegative().default(0),
  limit: z.number().int().nonnegative().default(0).optional().nullable(),
  img: z.string().max(255).optional().nullable(),
  association: z.string().max(255).optional().nullable(),
  logo: z.string().max(255).optional().nullable(),
  type: batchTypeEnumSchema.default('cohort'),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be in YYYY-MM-DD format'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be in YYYY-MM-DD format'),
  whatsAppLink: z.string().max(255).optional().nullable(),
  telegramLink: z.string().max(255).optional().nullable(),
  telegramBroadcast: z.string().max(255).optional().nullable(),
  teacherId: z.string().uuid().optional().nullable(),
  teacherPayment: z.boolean().default(false),
  meetingLink: z.string().max(255).optional().nullable(),
  nextClassTopic: z.string().max(255).optional().nullable(),
  desc: z.string().max(255).optional().nullable(),
  nextClass: z.string().refine((val) => !val || !isNaN(Date.parse(val)), 'Must be a valid date/time').optional().nullable(),
  status: batchStatusEnumSchema.default('private'),
  metadata: z.record(z.string(), z.any()).default({}),
  accessTillDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be in YYYY-MM-DD format').optional().nullable(),
  accessTillYear: z.number().int().min(1).default(1).optional().nullable(),
});

export const updateBatchSchema = createBatchSchema.partial();

export const batchSearchQuerySchema = z.object({
  q: z.string().default(''),
  type: batchTypeEnumSchema.optional(),
  status: batchStatusEnumSchema.optional(),
  limit: z.preprocess((val) => parseInt(val as string, 10), z.number().int().min(1).max(50).default(10)),
  page: z.preprocess((val) => parseInt(val as string, 10), z.number().int().min(1).default(1)),
});

export type CreateBatchInput = z.infer<typeof createBatchSchema>;
export type UpdateBatchInput = z.infer<typeof updateBatchSchema>;
export type BatchSearchQueryInput = z.infer<typeof batchSearchQuerySchema>;
