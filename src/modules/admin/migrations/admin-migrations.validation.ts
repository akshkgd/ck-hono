import { z } from 'zod';

export const legacyUserItemSchema = z.object({
  id: z.union([z.number(), z.string()]).optional(),
  name: z.string().optional().nullable(),
  email: z.string().email('Invalid email address'),
  mobile: z.string().optional().nullable(),
  avatar: z.string().optional().nullable(),
  avatarUrl: z.string().optional().nullable(),
  avatar_url: z.string().optional().nullable(),
  google_id: z.string().optional().nullable(),
  googleId: z.string().optional().nullable(),
  is_verified: z.union([z.number(), z.boolean()]).optional().nullable(),
  role: z.union([z.number(), z.string()]).optional().nullable(),
  status: z.union([z.number(), z.string()]).optional().nullable(),
  college: z.string().optional().nullable(),
  course: z.string().optional().nullable(),
  gender: z.string().optional().nullable(),
  coupan: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  telegramId: z.string().optional().nullable(),
  xp: z.number().optional().nullable(),
  current_streak: z.number().optional().nullable(),
  longest_streak: z.number().optional().nullable(),
  lastActivity: z.string().optional().nullable(),
  last_activity_date: z.string().optional().nullable(),
  created_at: z.string().optional().nullable(),
  updated_at: z.string().optional().nullable(),
  metadata: z.record(z.string(), z.any()).optional().nullable(),
});

export const bulkUserMigrationSchema = z.object({
  entity: z.string().optional(),
  batch_index: z.number().optional(),
  chunk_size: z.number().optional(),
  batchSize: z.number().min(10).max(5000).default(2000),
  dryRun: z.boolean().default(false),
  data: z.array(legacyUserItemSchema).optional(),
  users: z.array(legacyUserItemSchema).optional(),
});

export type LegacyUserItem = z.infer<typeof legacyUserItemSchema>;
export type BulkUserMigrationInput = z.infer<typeof bulkUserMigrationSchema>;
