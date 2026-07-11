import { z } from 'zod';

export const getCoursesQuerySchema = z.object({});

export const studentProgressSchema = z.object({
  batchContentId: z.number().int().positive(),
  timeSpent: z.number().int().nonnegative().default(0), // Delta time spent (seconds) since last ping
  progress: z.number().int().min(0).max(100).default(0), // Completion progress percentage (0-100)
  status: z.enum(['not_started', 'learning', 'completed']).default('learning'),
});

export type StudentProgressInput = z.infer<typeof studentProgressSchema>;

export const studentAssignmentSchema = z.object({
  githubLink: z.string().url('Must be a valid URL').or(z.string().length(0)).nullable().optional(),
  deployedLink: z.string().url('Must be a valid URL').or(z.string().length(0)).nullable().optional(),
  userRemark: z.string().nullable().optional(),
  codeSubmitted: z.string().nullable().optional(),
});

export type StudentAssignmentInput = z.infer<typeof studentAssignmentSchema>;
