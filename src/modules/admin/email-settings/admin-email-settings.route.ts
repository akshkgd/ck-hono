import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { adminEmailSettingsController } from './admin-email-settings.controller.js';
import { updateEmailSettingsSchema } from './admin-email-settings.validation.js';

export const adminEmailSettingsRouter = new Hono();

// GET /v1/admin/email-settings
adminEmailSettingsRouter.get('/', (c) => adminEmailSettingsController.getSettings(c));

// PUT /v1/admin/email-settings
adminEmailSettingsRouter.put(
  '/',
  zValidator('json', updateEmailSettingsSchema),
  (c) => adminEmailSettingsController.updateSettings(c)
);
