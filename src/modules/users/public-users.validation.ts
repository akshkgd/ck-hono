import { z } from 'zod';

export const publicUserQuerySchema = z.object({
  email: z.string().email('Invalid email address'),
});

export type PublicUserQueryInput = z.infer<typeof publicUserQuerySchema>;
