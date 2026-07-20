import { describe, it, expect } from 'vitest';
import { updateEmailSettingsSchema } from './admin-email-settings.validation.js';

describe('Admin Email Settings Module', () => {
  it('should validate updateEmailSettingsSchema correctly', () => {
    const validPayload = {
      enabled: true,
      enrollment: false,
      payment: true,
      accessGranted: false,
    };

    const parsed = updateEmailSettingsSchema.safeParse(validPayload);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.enrollment).toBe(false);
      expect(parsed.data.payment).toBe(true);
    }
  });

  it('should allow partial updates in updateEmailSettingsSchema', () => {
    const partialPayload = {
      enrollment: false,
    };

    const parsed = updateEmailSettingsSchema.safeParse(partialPayload);
    expect(parsed.success).toBe(true);
  });
});
