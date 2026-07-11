import { z } from 'zod';

export const getCoursesQuerySchema = z.object({});

export const studentProgressSchema = z.object({
  batchContentId: z.number().int().positive(),
  timeSpent: z.number().int().nonnegative().default(0), // Delta time spent (seconds) since last ping
  progress: z.number().int().min(0).max(100).default(0), // Completion progress percentage (0-100)
  status: z.enum(['not_started', 'learning', 'completed']).default('learning'),
});

export type StudentProgressInput = z.infer<typeof studentProgressSchema>;
