import { z } from 'zod';

export const reportsSummaryQuerySchema = z.object({});

export type ReportsSummaryQueryInput = z.infer<typeof reportsSummaryQuerySchema>;
