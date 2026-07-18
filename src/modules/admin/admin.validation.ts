import { z } from 'zod';

const roleSchema = z.preprocess(
  (val) => typeof val === 'string' ? val.toLowerCase() : val,
  z.enum(['student', 'admin', 'user', 'moderator'])
);

const statusSchema = z.preprocess(
  (val) => typeof val === 'string' ? val.toLowerCase() : val,
  z.enum(['active', 'inactive', 'suspended'])
);

export const adminAddUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  name: z.string().min(2, 'Name must be at least 2 characters long').optional(),
  mobile: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number').optional(),
  role: roleSchema.optional(),
  status: statusSchema.optional(),
});

export const adminUpdateUserSchema = z.object({
  email: z.string().email('Invalid email address').optional(),
  password: z.string().min(6, 'Password must be at least 6 characters long').optional(),
  name: z.string().min(2, 'Name must be at least 2 characters long').optional(),
  mobile: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number').optional(),
  avatarUrl: z.string().url('Invalid URL').nullable().optional(),
  bio: z.string().max(500, 'Bio must be at most 500 characters').nullable().optional(),
  linkedinUrl: z.string().url('Invalid URL').nullable().optional(),
  githubUrl: z.string().url('Invalid URL').nullable().optional(),
  occupationType: z.enum(['student', 'professional', 'academic', 'other']).optional(),
  occupationTitle: z.string().max(100).nullable().optional(),
  organization: z.string().max(150).nullable().optional(),
  experienceYears: z.number().int().min(0).max(100).nullable().optional(),
  emailVerified: z.boolean().optional(),
  xp: z.number().int().min(0).optional(),
  currentStreak: z.number().int().min(0).optional(),
  longestStreak: z.number().int().min(0).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
  role: roleSchema.optional(),
  status: statusSchema.optional(),
});

export const adminUpdateRoleSchema = z.object({
  role: roleSchema,
});

export const adminUpdateStatusSchema = z.object({
  status: statusSchema,
});

export const adminSearchQuerySchema = z.object({
  q: z.string().optional().default(''),
  role: z.enum(['student', 'admin', 'user', 'moderator']).optional(),
  sortBy: z.enum(['createdAt', 'name', 'email', 'xp', 'lastActiveAt']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  page: z.coerce.number().int().min(1).default(1),
  timeRange: z.enum([
    'today',
    'yesterday',
    'this_week',
    'last_week',
    'this_month',
    'last_month',
    'custom'
  ]).optional().nullable(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD').optional().nullable(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD').optional().nullable(),
}).refine((data) => {
  if (data.timeRange === 'custom') {
    return !!data.startDate && !!data.endDate;
  }
  return true;
}, {
  message: 'startDate and endDate are required when timeRange is set to custom',
  path: ['startDate']
});

export type AdminAddUserInput = z.infer<typeof adminAddUserSchema>;
export type AdminUpdateUserInput = z.infer<typeof adminUpdateUserSchema>;
export type AdminUpdateRoleInput = z.infer<typeof adminUpdateRoleSchema>;
export type AdminUpdateStatusInput = z.infer<typeof adminUpdateStatusSchema>;
export type AdminSearchQueryInput = z.infer<typeof adminSearchQuerySchema>;
