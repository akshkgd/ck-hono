import { MigrationJobData } from '../queues/index.js';
import { logger } from '../utils/logger.js';
import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { Job } from 'bullmq';

const emailRegex = /^(?!\\.)(?!.*\\.\\.)([A-Za-z0-9_'+\\-\\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\\-]*\\.)+[A-Za-z]{2,}$/;

function isValidEmail(email: any): boolean {
  if (!email || typeof email !== 'string') return false;
  const clean = email.trim();
  if (clean.length < 5 || clean.length > 254) return false;
  return emailRegex.test(clean);
}

function parseRole(role: any): 'student' | 'admin' | 'user' | 'moderator' {
  if (role === undefined || role === null) return 'student';
  const roleStr = String(role).trim().toLowerCase();
  const roleNum = Number(role);

  if (roleNum === 100 || roleStr === '100' || roleStr === 'admin') {
    return 'admin';
  }
  if (roleStr === 'moderator') {
    return 'moderator';
  }
  return 'student';
}

function parseStatus(status: any): 'active' | 'inactive' | 'suspended' {
  if (status === undefined || status === null) return 'active';
  const statusStr = String(status).trim().toLowerCase();
  const statusNum = Number(status);

  if (statusNum === 0 || statusStr === '0' || statusStr === 'inactive' || statusStr === 'deactivated') {
    return 'inactive';
  }
  if (statusStr === 'suspended' || statusStr === 'banned') {
    return 'suspended';
  }
  return 'active';
}

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
        const recordsToInsert: any[] = [];

        // Filter and transform legacy PHP payload rows
        for (const u of chunk) {
          // Skip users with invalid/missing emails
          if (!isValidEmail(u.email)) {
            logger.warn(`[MigrationJob] Skipping user record with invalid email: "${u.email}" (Legacy ID: ${u.id || 'N/A'})`);
            failedCount++;
            continue;
          }

          const cleanEmail = String(u.email).toLowerCase().trim();

          // 1. Robust Role Parsing (100 / "100" / "admin" -> 'admin')
          const roleValue = parseRole(u.role);

          // 2. Robust Status Parsing (0 / "0" / "inactive" -> 'inactive')
          const statusValue = parseStatus(u.status);

          // 3. Normalize email verification (1 -> true)
          const isVerified = u.is_verified === 1 || u.is_verified === '1' || u.is_verified === true || u.emailVerified === true;

          // 4. Occupation Mapping Logic:
          const organizationValue = u.college || u.organization || null;
          const validOccupationTypes = ['student', 'professional', 'academic', 'other'];
          let occType: 'student' | 'professional' | 'academic' | 'other' = 'student';

          if (u.occupationType && validOccupationTypes.includes(u.occupationType)) {
            occType = u.occupationType;
          } else {
            occType = 'student';
          }

          const occTitle = occType === 'student' ? null : (u.course || u.occupationTitle || null);

          // 5. Clean metadata object (only legacyId and explicit metadata)
          const extraMetadata = {
            legacyId: u.id || null,
            ...(u.metadata || {}),
          };

          recordsToInsert.push({
            email: cleanEmail,
            name: u.name || u.user_name || cleanEmail.split('@')[0],
            mobile: u.mobile || null,
            googleId: u.google_id || u.googleId || null,
            avatarUrl: u.avatar || u.avatarUrl || u.avatar_url || null,
            bio: u.bio || null,
            role: roleValue,
            status: statusValue,
            emailVerified: isVerified,
            xp: typeof u.xp === 'number' ? u.xp : (Number(u.xp) || 0),
            currentStreak: typeof u.current_streak === 'number' ? u.current_streak : (Number(u.current_streak) || 0),
            longestStreak: typeof u.longest_streak === 'number' ? u.longest_streak : (Number(u.longest_streak) || 0),
            organization: organizationValue,
            occupationTitle: occTitle,
            occupationType: occType,
            metadata: extraMetadata,
            createdAt: u.created_at ? new Date(u.created_at) : new Date(),
            updatedAt: u.updated_at ? new Date(u.updated_at) : new Date(),
            lastActiveAt: u.lastActivity ? new Date(u.lastActivity) : (u.last_activity_date ? new Date(u.last_activity_date) : new Date()),
          });
        }

        // High-Performance Batch Insert with ON CONFLICT DO NOTHING for valid records
        if (recordsToInsert.length > 0) {
          await db.insert(users).values(recordsToInsert).onConflictDoNothing({ target: users.email });
          successCount += recordsToInsert.length;
        }
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
    logger.info(`[MigrationJob] Bulk User Migration Completed: ${successCount} inserted, ${failedCount} failed/skipped in ${durationMs}ms`);

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
