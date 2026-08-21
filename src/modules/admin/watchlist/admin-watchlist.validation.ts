import { z } from 'zod';

export const addToWatchlistSchema = z.object({
  enrollmentId: z.string().uuid('Invalid enrollment ID'),
  reason: z.string().max(1000, 'Reason must be under 1000 characters').optional(),
  lastFollowup: z.coerce.date().optional().nullable(),
});

export const updateWatchlistSchema = z.object({
  reason: z.string().max(1000, 'Reason must be under 1000 characters').optional().nullable(),
  lastFollowup: z.coerce.date().optional().nullable(),
});

export const listWatchlistSchema = z.object({
  batchId: z.string().uuid().optional(),
  q: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(50, 'Minimum limit is 50').max(200, 'Maximum limit is 200').default(50),
});

export type AddToWatchlistInput = z.infer<typeof addToWatchlistSchema>;
export type UpdateWatchlistInput = z.infer<typeof updateWatchlistSchema>;
export type ListWatchlistQuery = z.infer<typeof listWatchlistSchema>;
