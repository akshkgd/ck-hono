import { z } from 'zod';

export const assignmentsQuerySchema = z.object({
  timeRange: z.enum([
    'today',
    'yesterday',
    'this_week',
    'last_week',
    'this_month',
    'last_month',
    'custom'
  ]).default('this_week'),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD').optional().nullable(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD').optional().nullable(),
  status: z.enum(['pending', 'submitted', 'under review', 'approved', 'rejected']).optional().nullable(),
  batchId: z.string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined))
    .refine((val) => val === undefined || !isNaN(val), 'batchId must be a valid number'),
  email: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  page: z.string()
    .default('1')
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0, 'page must be positive number'),
  limit: z.string()
    .default('50')
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0 && val <= 100, 'limit must be between 1 and 100'),
}).refine((data) => {
  if (data.timeRange === 'custom') {
    return !!data.startDate && !!data.endDate;
  }
  return true;
}, {
  message: 'startDate and endDate are required when timeRange is set to custom',
  path: ['startDate']
});

export const gradeAssignmentSchema = z.object({
  assignmentStatus: z.enum(['pending', 'submitted', 'under review', 'approved', 'rejected']),
  teacherRemark: z.string().nullable().optional(),
  videoFeedback: z.string().url('Must be a valid URL').or(z.string().length(0)).nullable().optional(),
  codeSubmittedStatus: z.enum(['Accepted', 'rejected', 'attempted']).nullable().optional(),
});

export type AssignmentsQueryInput = z.infer<typeof assignmentsQuerySchema>;
export type GradeAssignmentInput = z.infer<typeof gradeAssignmentSchema>;
