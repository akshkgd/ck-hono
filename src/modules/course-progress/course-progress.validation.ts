import { z } from 'zod';

export const userStatusSchema = z.enum(['not_started', 'learning', 'completed']);

export const upsertProgressSchema = z.object({
  batchContentId: z.number().int().positive(),
  timeSpent: z.number().int().nonnegative().default(0),
  progress: z.number().int().min(0).max(100).default(0),
  status: userStatusSchema.default('not_started'),
});

export type UpsertProgressInput = z.infer<typeof upsertProgressSchema>;
