import { z } from 'zod';

export const userMigrationItemSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().optional(),
  mobile: z.string().optional(),
  role: z.enum(['student', 'admin', 'user', 'moderator']).default('student'),
  status: z.enum(['active', 'inactive', 'suspended']).default('active'),
  avatarUrl: z.string().url().optional(),
  bio: z.string().optional(),
  linkedinUrl: z.string().optional(),
  githubUrl: z.string().optional(),
  occupationType: z.enum(['student', 'professional', 'academic', 'other']).default('other'),
  occupationTitle: z.string().optional(),
  organization: z.string().optional(),
  experienceYears: z.number().optional(),
  xp: z.number().default(0),
  metadata: z.record(z.string(), z.any()).optional(),
  createdAt: z.string().optional(),
});

export const bulkUserMigrationSchema = z.object({
  batchSize: z.number().min(100).max(5000).default(2000),
  dryRun: z.boolean().default(false),
  users: z.array(userMigrationItemSchema),
});

export type UserMigrationItem = z.infer<typeof userMigrationItemSchema>;
export type BulkUserMigrationInput = z.infer<typeof bulkUserMigrationSchema>;
