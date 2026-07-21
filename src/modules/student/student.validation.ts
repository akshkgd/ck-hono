import { z } from 'zod';

export const getCoursesQuerySchema = z.object({});

export const studentProgressSchema = z.object({
  batchContentId: z.string(),
  timeSpent: z.number().int().nonnegative().default(0), // Delta time spent (seconds) since last ping
  progress: z.number().int().min(0).max(100).default(0), // Completion progress percentage (0-100)
  status: z.enum(['not_started', 'learning', 'completed']).default('learning'),
  lastWatchedPosition: z.number().int().nonnegative().default(0), // Latest playback timestamp in seconds
});

export type StudentProgressInput = z.infer<typeof studentProgressSchema>;

export const studentAssignmentSchema = z.object({
  githubLink: z.string().url('Must be a valid URL').or(z.string().length(0)).nullable().optional(),
  deployedLink: z.string().url('Must be a valid URL').or(z.string().length(0)).nullable().optional(),
  userRemark: z.string().nullable().optional(),
  codeSubmitted: z.string().nullable().optional(),
});

export type StudentAssignmentInput = z.infer<typeof studentAssignmentSchema>;

export const updateProfileSchema = z.object({
  name: z.string().max(255).optional().nullable(),
  mobile: z.string().max(20).optional().nullable(),
  bio: z.string().optional().nullable(),
  linkedinUrl: z.string().url('Must be a valid URL').or(z.string().length(0)).optional().nullable(),
  githubUrl: z.string().url('Must be a valid URL').or(z.string().length(0)).optional().nullable(),
  occupationType: z.enum(['student', 'professional', 'academic', 'other']).optional(),
  occupationTitle: z.string().max(100).optional().nullable(),
  organization: z.string().max(150).optional().nullable(),
  experienceYears: z.number().int().min(0).optional().nullable(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
