import { Context } from 'hono';
import { systemSettingsRepository } from '../../system/system-settings.repository.js';
import { UpdateEmailSettingsInput } from './admin-email-settings.validation.js';

export class AdminEmailSettingsController {
  /**
   * GET /v1/admin/email-settings
   * Retrieve current email toggle states for Admin Frontend
   */
  async getSettings(c: Context) {
    const settings = await systemSettingsRepository.getEmailSettings();
    return c.json({
      success: true,
      message: 'Email settings retrieved successfully',
      data: settings,
    });
  }

  /**
   * PUT /v1/admin/email-settings
   * Update email toggle states from Admin Frontend
   */
  async updateSettings(c: Context) {
    const body: UpdateEmailSettingsInput = await c.req.json();
    const updated = await systemSettingsRepository.updateEmailSettings(body);
    return c.json({
      success: true,
      message: 'Email settings updated successfully',
      data: updated,
    });
  }
}

export const adminEmailSettingsController = new AdminEmailSettingsController();
