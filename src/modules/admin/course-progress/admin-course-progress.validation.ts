import { z } from 'zod';

export const progressQuerySchema = z.object({
  timeRange: z.enum([
    'today',
    'yesterday',
    'this_week',
    'last_week',
    'this_month',
    'last_month',
    'custom'
  ]).default('this_week'),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD').optional().nullable(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD').optional().nullable(),
  batchId: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  page: z.string()
    .default('1')
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0, 'page must be positive number'),
  limit: z.string()
    .default('50')
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0 && val <= 100, 'limit must be between 1 and 100'),
}).refine((data) => {
  if (data.timeRange === 'custom') {
    return !!data.startDate && !!data.endDate;
  }
  return true;
}, {
  message: 'startDate and endDate are required when timeRange is set to custom',
  path: ['startDate']
});

export type ProgressQueryInput = z.infer<typeof progressQuerySchema>;

export const enrollmentProgressParamsSchema = z.object({
  enrollmentId: z.string(),
});

export type EnrollmentProgressParamsInput = z.infer<typeof enrollmentProgressParamsSchema>;
