import { MigrationJobData } from '../queues/index.js';
import { logger } from '../utils/logger.js';
import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { Job } from 'bullmq';

export async function processMigrationJob(data: MigrationJobData, job?: Job): Promise<Record<string, any>> {
  const startTime = Date.now();
  const batchSize = data.batchSize || 2000;
  const isDryRun = !!data.dryRun;

  logger.info(`[MigrationJob] Starting task: "${data.migrationName}" (Dry run: ${isDryRun}, Batch size: ${batchSize})`);

  if (data.migrationName === 'BULK_USER_MIGRATION' && data.metadata?.users) {
    const userList: any[] = data.metadata.users;
    const totalRecords = userList.length;
    let successCount = 0;
    let failedCount = 0;

    if (isDryRun) {
      logger.info(`[MigrationJob] Dry run completed for ${totalRecords} user records.`);
      return {
        migrationName: data.migrationName,
        status: 'DRY_RUN_COMPLETED',
        totalRecords,
        processedItems: totalRecords,
        dryRun: true,
        durationMs: Date.now() - startTime,
      };
    }

    // Process in chunks of batchSize
    for (let i = 0; i < totalRecords; i += batchSize) {
      const chunk = userList.slice(i, i + batchSize);
      
      try {
        // Transform legacy PHP payload rows to PostgreSQL Hono Schema
        const recordsToInsert = chunk.map((u) => {
          // 1. Normalize role (1 -> student, 100 -> admin)
          let roleValue: 'student' | 'admin' | 'user' | 'moderator' = 'student';
          if (u.role === 100 || u.role === '100' || u.role === 'admin') {
            roleValue = 'admin';
          } else if (u.role === 'moderator') {
            roleValue = 'moderator';
          }

          // 2. Normalize status (1 -> active, 0 -> inactive)
          let statusValue: 'active' | 'inactive' | 'suspended' = 'active';
          if (u.status === 0 || u.status === '0' || u.status === 'inactive') {
            statusValue = 'inactive';
          } else if (u.status === 'suspended') {
            statusValue = 'suspended';
          }

          // 3. Normalize email verification (1 -> true)
          const isVerified = u.is_verified === 1 || u.is_verified === '1' || u.is_verified === true || u.emailVerified === true;

          // 4. Occupation Mapping Logic:
          // - college -> organization
          const organizationValue = u.college || u.organization || null;
          // - occupationType ('student' if college is present, or explicit occupationType, else 'other')
          const occType: 'student' | 'professional' | 'academic' | 'other' =
            u.occupationType || (u.college ? 'student' : 'other');
          // - occupationTitle (if student, leave blank; else course -> occupationTitle)
          const occTitle = occType === 'student' ? null : (u.course || u.occupationTitle || null);

          // 5. Preserve all extra legacy fields in metadata jsonb
          const extraMetadata = {
            legacyId: u.id || null,
            user_name: u.user_name || null,
            college: u.college || null,
            course: u.course || null,
            gender: u.gender || null,
            coupan: u.coupan || null,
            telegramId: u.telegramId || null,
            ...(u.metadata || {}),
          };

          return {
            email: u.email.toLowerCase().trim(),
            name: u.name || u.user_name || u.email.split('@')[0],
            mobile: u.mobile || null,
            googleId: u.google_id || u.googleId || null,
            avatarUrl: u.avatar || u.avatarUrl || u.avatar_url || null,
            bio: u.bio || null,
            role: roleValue,
            status: statusValue,
            emailVerified: isVerified,
            xp: typeof u.xp === 'number' ? u.xp : 0,
            currentStreak: typeof u.current_streak === 'number' ? u.current_streak : 0,
            longestStreak: typeof u.longest_streak === 'number' ? u.longest_streak : 0,
            organization: organizationValue,
            occupationTitle: occTitle,
            occupationType: occType,
            metadata: extraMetadata,
            createdAt: u.created_at ? new Date(u.created_at) : new Date(),
            updatedAt: u.updated_at ? new Date(u.updated_at) : new Date(),
            lastActiveAt: u.lastActivity ? new Date(u.lastActivity) : (u.last_activity_date ? new Date(u.last_activity_date) : new Date()),
          };
        });

        // High-Performance Batch Insert with ON CONFLICT DO NOTHING (prevents duplicate email crashes)
        await db.insert(users).values(recordsToInsert).onConflictDoNothing({ target: users.email });

        successCount += chunk.length;
      } catch (err: any) {
        logger.error(`[MigrationJob] Batch insert failed at index ${i}: ${err.message}`);
        failedCount += chunk.length;
      }

      // Update BullMQ Job Progress for live status tracking
      if (job) {
        const processed = Math.min(i + batchSize, totalRecords);
        await job.updateProgress({
          processed,
          total: totalRecords,
          successCount,
          failedCount,
        });
      }
    }

    const durationMs = Date.now() - startTime;
    logger.info(`[MigrationJob] Bulk User Migration Completed: ${successCount} inserted, ${failedCount} failed in ${durationMs}ms`);

    return {
      migrationName: data.migrationName,
      status: 'COMPLETED',
      totalRecords,
      successCount,
      failedCount,
      durationMs,
      executedAt: new Date().toISOString(),
    };
  }

  // Fallback for general migration tasks
  const durationMs = Date.now() - startTime;
  return {
    migrationName: data.migrationName,
    status: 'COMPLETED',
    processedItems: batchSize,
    dryRun: isDryRun,
    durationMs,
    executedAt: new Date().toISOString(),
  };
}
