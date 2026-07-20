import { db } from '../../db/index.js';
import { systemSettings } from '../../db/schema.js';
import { eq } from 'drizzle-orm';
import { logger } from '../../utils/logger.js';

export interface EmailSettingsConfig {
  enabled: boolean;
  enrollment: boolean;
  payment: boolean;
  accessGranted: boolean;
}

const DEFAULT_EMAIL_SETTINGS: EmailSettingsConfig = {
  enabled: process.env.EMAIL_NOTIFICATIONS_ENABLED !== 'false',
  enrollment: process.env.EMAIL_NOTIFY_ENROLLMENT !== 'false',
  payment: process.env.EMAIL_NOTIFY_PAYMENT !== 'false',
  accessGranted: process.env.EMAIL_NOTIFY_ACCESS_GRANTED !== 'false',
};

const SETTINGS_KEY = 'email_notification_toggles';
const CACHE_TTL_MS = 30000; // 30 seconds fast cache

class SystemSettingsRepository {
  private cachedEmailSettings: EmailSettingsConfig | null = null;
  private lastFetchedAt: number = 0;

  /**
   * Get email notification toggles with O(1) in-memory fast caching
   * Automatically populates system_settings table with default row if missing.
   */
  async getEmailSettings(): Promise<EmailSettingsConfig> {
    const now = Date.now();
    if (this.cachedEmailSettings && (now - this.lastFetchedAt < CACHE_TTL_MS)) {
      return this.cachedEmailSettings;
    }

    try {
      const records = await db.select()
        .from(systemSettings)
        .where(eq(systemSettings.key, SETTINGS_KEY))
        .limit(1);

      if (records.length > 0 && records[0].value) {
        const val = records[0].value as Partial<EmailSettingsConfig>;
        this.cachedEmailSettings = {
          enabled: val.enabled ?? DEFAULT_EMAIL_SETTINGS.enabled,
          enrollment: val.enrollment ?? DEFAULT_EMAIL_SETTINGS.enrollment,
          payment: val.payment ?? DEFAULT_EMAIL_SETTINGS.payment,
          accessGranted: val.accessGranted ?? DEFAULT_EMAIL_SETTINGS.accessGranted,
        };
      } else {
        // Auto-seed default settings row into system_settings table
        this.cachedEmailSettings = DEFAULT_EMAIL_SETTINGS;
        await db.insert(systemSettings)
          .values({
            key: SETTINGS_KEY,
            value: DEFAULT_EMAIL_SETTINGS,
            description: 'Dynamic Email Notification Event Toggles',
            updatedAt: new Date(),
          })
          .onConflictDoNothing();
      }
    } catch (err: any) {
      logger.error(`[SystemSettings] Failed to fetch settings from DB, using fallback: ${err.message}`);
      this.cachedEmailSettings = DEFAULT_EMAIL_SETTINGS;
    }

    this.lastFetchedAt = now;
    return this.cachedEmailSettings;
  }

  /**
   * Update email notification toggles and invalidate cache immediately
   */
  async updateEmailSettings(newSettings: Partial<EmailSettingsConfig>): Promise<EmailSettingsConfig> {
    const current = await this.getEmailSettings();
    const updated: EmailSettingsConfig = {
      enabled: newSettings.enabled ?? current.enabled,
      enrollment: newSettings.enrollment ?? current.enrollment,
      payment: newSettings.payment ?? current.payment,
      accessGranted: newSettings.accessGranted ?? current.accessGranted,
    };

    await db.insert(systemSettings)
      .values({
        key: SETTINGS_KEY,
        value: updated,
        description: 'Dynamic Email Notification Event Toggles',
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: systemSettings.key,
        set: {
          value: updated,
          updatedAt: new Date(),
        },
      });

    // Invalidate and refresh cache instantly
    this.cachedEmailSettings = updated;
    this.lastFetchedAt = Date.now();

    logger.info(`[SystemSettings] Email notification toggles updated: ${JSON.stringify(updated)}`);
    return updated;
  }

  /**
   * Synchronous check for fast queue evaluation
   */
  getFastCachedSettings(): EmailSettingsConfig {
    return this.cachedEmailSettings || DEFAULT_EMAIL_SETTINGS;
  }
}

export const systemSettingsRepository = new SystemSettingsRepository();
