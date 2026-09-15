import { z } from 'zod';

export const createLiveSessionSchema = z.object({
  topic: z.string().min(1, 'Topic is required').max(255),
  desc: z.string().optional().nullable(),
  time: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date/time format'
  }),
  sectionId: z.string().uuid('Invalid section UUID').optional().nullable(),
  screenHlsVideo: z.string().url('Invalid URL format').or(z.literal('')).optional().nullable(),
  faceHlsVideo: z.string().url('Invalid URL format').or(z.literal('')).optional().nullable(),
  recordingHls: z.string().url('Invalid URL format').or(z.literal('')).optional().nullable(),
  order: z.number().int().nonnegative().default(0),
  dummyCount: z.number().int().nonnegative().optional().nullable(),
});

export const updateLiveSessionSchema = z.object({
  topic: z.string().min(1, 'Topic is required').max(255).optional(),
  desc: z.string().optional().nullable(),
  time: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date/time format'
  }).optional(),
  sectionId: z.string().uuid('Invalid section UUID').optional().nullable(),
  screenHlsVideo: z.string().url('Invalid URL format').or(z.literal('')).optional().nullable(),
  faceHlsVideo: z.string().url('Invalid URL format').or(z.literal('')).optional().nullable(),
  recordingHls: z.string().url('Invalid URL format').or(z.literal('')).optional().nullable(),
  order: z.number().int().nonnegative().optional(),
  dummyCount: z.number().int().nonnegative().optional().nullable(),
});

export const queryLiveSessionSchema = z.object({
  sectionId: z.string().optional().nullable(),
});

export const listAllLiveSessionsQuerySchema = z.object({
  status: z.enum(['upcoming', 'past', 'all']).optional().default('all'),
  batchId: z.string().uuid('Invalid batch UUID').optional().nullable(),
  search: z.string().optional().nullable(),
  page: z.preprocess(
    (val) => (val ? parseInt(val as string, 10) : undefined),
    z.number().int().min(1).default(1)
  ),
  limit: z.preprocess(
    (val) => (val ? parseInt(val as string, 10) : undefined),
    z.number().int().min(1).max(100).default(20)
  ),
});

export const recordAttendanceSchema = z.object({
  email: z.string().email('Invalid email address'),
  liveSessionId: z.string().uuid('Invalid live session UUID'),
  status: z.enum(['joined', 'left']),
  durationSeconds: z.number().int().nonnegative().optional(),
}).refine(
  (data) => {
    if (data.status === 'left' && data.durationSeconds === undefined) {
      return false;
    }
    return true;
  },
  {
    message: 'durationSeconds is required when status is left',
    path: ['durationSeconds'],
  }
);

export type CreateLiveSessionInput = z.infer<typeof createLiveSessionSchema>;
export type UpdateLiveSessionInput = z.infer<typeof updateLiveSessionSchema>;
export type QueryLiveSessionInput = z.infer<typeof queryLiveSessionSchema>;
export type ListAllLiveSessionsQueryInput = z.infer<typeof listAllLiveSessionsQuerySchema>;
export type RecordAttendanceInput = z.infer<typeof recordAttendanceSchema>;
