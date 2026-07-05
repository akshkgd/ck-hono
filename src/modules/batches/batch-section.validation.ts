import { z } from 'zod';

export const createBatchSectionSchema = z.object({
  title: z.string().min(1).max(255),
  batchId: z.number().int().positive().optional().nullable(),
  order: z.number().int().optional().nullable(),
});

export const updateBatchSectionSchema = createBatchSectionSchema.partial();

export const batchSectionSearchQuerySchema = z.object({
  q: z.string().default(''),
  batchId: z.preprocess((val) => val ? parseInt(val as string, 10) : undefined, z.number().int().positive().optional()),
  limit: z.preprocess((val) => val ? parseInt(val as string, 10) : undefined, z.number().int().min(1).max(50).default(10)),
  page: z.preprocess((val) => val ? parseInt(val as string, 10) : undefined, z.number().int().min(1).default(1)),
});

export type CreateBatchSectionInput = z.infer<typeof createBatchSectionSchema>;
export type UpdateBatchSectionInput = z.infer<typeof updateBatchSectionSchema>;
export type BatchSectionSearchQueryInput = z.infer<typeof batchSectionSearchQuerySchema>;

export const batchSectionReorderSchema = z.object({
  orders: z.array(
    z.object({
      id: z.number().int().positive(),
      order: z.number().int(),
    })
  ),
});

export type BatchSectionReorderInput = z.infer<typeof batchSectionReorderSchema>;
