import { z } from 'zod';
import { type DateRangePreset } from '../../../utils/date-range.js';

export const dateRangePresetSchema = z.enum([
  'today',
  'yesterday',
  'thisMonth',
  'lastMonth',
  'last7Days',
  'thisYear',
  'custom',
]);

export const analyticsOverviewQuerySchema = z.object({
  range: dateRangePresetSchema.optional().default('last7Days'),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD').optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD').optional(),
  limit: z.preprocess((val) => val ? parseInt(val as string, 10) : undefined, z.number().int().min(1).max(100).default(50)),
  page: z.preprocess((val) => val ? parseInt(val as string, 10) : undefined, z.number().int().min(1).default(1)),
});

export type AnalyticsOverviewQueryInput = z.infer<typeof analyticsOverviewQuerySchema>;
