import { z } from 'zod';

export const updateEmailSettingsSchema = z.object({
  enabled: z.boolean().optional(),
  enrollment: z.boolean().optional(),
  payment: z.boolean().optional(),
  accessGranted: z.boolean().optional(),
});

export type UpdateEmailSettingsInput = z.infer<typeof updateEmailSettingsSchema>;
