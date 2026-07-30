import { z } from 'zod';

export const createBugSchema = z.object({
  description: z.string().min(5, "Description must be at least 5 characters"),
  severity: z.enum(['low', 'medium', 'high', 'critical']).default('medium').optional(),
  url: z.string().max(1024).url({ message: "Must be a valid URL" }).or(z.string().length(0)).nullable().optional(),
  deviceInfo: z.record(z.string(), z.any()).default({}).optional(),
  screenshotUrl: z.string().max(255).url({ message: "Must be a valid URL" }).or(z.string().length(0)).nullable().optional(),
});

export const updateBugSchema = z.object({
  severity: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  status: z.enum(['pending', 'investigating', 'resolved', 'closed']).optional(),
  remarks: z.string().max(2000).nullable().optional(),
});

export const bugSearchQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  q: z.string().optional(),
  status: z.enum(['pending', 'investigating', 'resolved', 'closed']).optional(),
  severity: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type CreateBugInput = z.infer<typeof createBugSchema>;
export type UpdateBugInput = z.infer<typeof updateBugSchema>;
export type BugSearchQueryInput = z.infer<typeof bugSearchQuerySchema>;
