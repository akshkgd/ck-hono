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
  batchId: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  q: z.string().optional().default(''),
  page: z.preprocess((val) => val ? parseInt(val as string, 10) : undefined, z.number().int().min(1).default(1)),
  limit: z.preprocess((val) => val ? parseInt(val as string, 10) : undefined, z.number().int().min(1).max(100).default(50)),
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
  notifyUser: z.boolean().optional().default(false),
});

export type AssignmentsQueryInput = z.infer<typeof assignmentsQuerySchema>;
export type GradeAssignmentInput = z.infer<typeof gradeAssignmentSchema>;

export const enrollmentAssignmentsParamsSchema = z.object({
  enrollmentId: z.string(),
});

export type EnrollmentAssignmentsParamsInput = z.infer<typeof enrollmentAssignmentsParamsSchema>;

export const singleAssignmentParamsSchema = z.object({
  progressId: z.string(),
});

export type SingleAssignmentParamsInput = z.infer<typeof singleAssignmentParamsSchema>;
