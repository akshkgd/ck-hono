import { z } from 'zod';

export const contentLibraryTypeSchema = z.enum(['video', 'coding lab', 'assignment', 'article']);
export const contentTypeClassSchema = z.enum(['primary', 'secondary']);

export const createContentLibrarySchema = z.object({
  title: z.string().min(1).max(255),
  desc: z.string().optional().nullable(),
  type: contentLibraryTypeSchema,
  contentType: contentTypeClassSchema.default('primary'),
  videoLink: z.string().max(255).optional().nullable(),
  solutionCode: z.string().optional().nullable(),
  hints: z.any().optional().nullable(),
  metadata: z.record(z.string(), z.any()).default({}),
});

export const updateContentLibrarySchema = createContentLibrarySchema.partial();

export const contentLibrarySearchQuerySchema = z.object({
  q: z.string().default(''),
  type: contentLibraryTypeSchema.optional(),
  limit: z.preprocess((val) => parseInt(val as string, 10), z.number().int().min(1).max(50).default(10)),
  page: z.preprocess((val) => parseInt(val as string, 10), z.number().int().min(1).default(1)),
});

export type CreateContentLibraryInput = z.infer<typeof createContentLibrarySchema>;
export type UpdateContentLibraryInput = z.infer<typeof updateContentLibrarySchema>;
export type ContentLibrarySearchQueryInput = z.infer<typeof contentLibrarySearchQuerySchema>;
