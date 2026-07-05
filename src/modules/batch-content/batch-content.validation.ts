import { z } from 'zod';

export const createBatchContentSchema = z.object({
  batchId: z.number().int().positive(),
  contentId: z.number().int().positive(),
  sectionId: z.number().int().positive(),
  order: z.number().int().optional().nullable(),
  accessOn: z.number().int().nonnegative().default(0),
  accessTill: z.number().int().nonnegative().default(0),
  accessOnDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD').optional().nullable(),
  accessTillDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD').optional().nullable(),
  metadata: z.record(z.string(), z.any()).default({}),
});

export const updateBatchContentSchema = createBatchContentSchema.partial();

export const batchContentSearchQuerySchema = z.object({
  batchId: z.preprocess((val) => val ? parseInt(val as string, 10) : undefined, z.number().int().positive().optional()),
  sectionId: z.preprocess((val) => val ? parseInt(val as string, 10) : undefined, z.number().int().positive().optional()),
  limit: z.preprocess((val) => val ? parseInt(val as string, 10) : undefined, z.number().int().min(1).max(50).default(10)),
  page: z.preprocess((val) => val ? parseInt(val as string, 10) : undefined, z.number().int().min(1).default(1)),
});

export const batchContentReorderSchema = z.object({
  orders: z.array(
    z.object({
      id: z.number().int().positive(),
      order: z.number().int(),
    })
  ),
});

export type CreateBatchContentInput = z.infer<typeof createBatchContentSchema>;
export type UpdateBatchContentInput = z.infer<typeof updateBatchContentSchema>;
export type BatchContentSearchQueryInput = z.infer<typeof batchContentSearchQuerySchema>;
export type BatchContentReorderInput = z.infer<typeof batchContentReorderSchema>;
