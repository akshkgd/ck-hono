import { z } from 'zod';

export const publicLiveSessionParamSchema = z.object({
  id: z.string().uuid('Invalid live session UUID'),
});

export const publicRecordAttendanceSchema = z.object({
  userId: z.string().uuid('Invalid user UUID'),
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

export type PublicLiveSessionParamInput = z.infer<typeof publicLiveSessionParamSchema>;
export type PublicRecordAttendanceInput = z.infer<typeof publicRecordAttendanceSchema>;
