import { addMigrationJob, migrationQueue } from '../../../queues/index.js';
import { BulkUserMigrationInput, BulkBatchMigrationInput, BulkEnrollmentMigrationInput, BulkPaymentMigrationInput } from './admin-migrations.validation.js';
import { logJobStart } from '../../../workers/audit.js';
import { processMigrationJob } from '../../../jobs/migration.job.js';
import { db } from '../../../db/index.js';
import { users, jobAuditLogs, batches, batchEnrollments, batchEnrollmentPayments } from '../../../db/schema.js';
import { sql, eq, desc } from 'drizzle-orm';

export class AdminMigrationsService {
  /**
   * Queue & Process a Bulk User Migration Job
   */
  async queueUserMigration(input: BulkUserMigrationInput, adminId: string) {
    const userRecords = input.data || input.users || [];
    const totalRecords = userRecords.length;
    const batchSize = input.chunk_size || input.batchSize || 2000;
    const jobId = `user_mig_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    // Create lightweight audit log entry (omits huge raw user array payload)
    await logJobStart(
      jobId,
      'migration-queue',
      'USER_MIGRATION',
      {
        totalRecords,
        batchSize,
        dryRun: input.dryRun,
        initiatedBy: adminId,
      }
    );

    // Queue background migration job in BullMQ
    const job = await addMigrationJob(
      'process-user-migration',
      {
        migrationName: 'BULK_USER_MIGRATION',
        batchSize,
        dryRun: input.dryRun,
        metadata: {
          jobId,
          adminId,
          totalRecords,
          users: userRecords,
        },
      },
      { jobId }
    );

    // Execute direct inline batch insertion immediately (guarantees execution even if worker daemon is paused)
    processMigrationJob({
      migrationName: 'BULK_USER_MIGRATION',
      batchSize,
      dryRun: input.dryRun,
      metadata: {
        jobId,
        adminId,
        totalRecords,
        users: userRecords,
      },
    }).catch((err) => console.error(`[InlineMigration] Error processing batch ${jobId}:`, err));

    return {
      jobId,
      bullJobId: job.id,
      totalRecords,
      batchSize,
      dryRun: input.dryRun,
      status: 'processing',
      statusUrl: `/v1/admin/migrations/status/${jobId}`,
    };
  }

  /**
   * Queue & Process a Bulk Batch Migration Job
   */
  async queueBatchMigration(input: BulkBatchMigrationInput, adminId: string) {
    const batchRecords = input.data || input.batches || [];
    const totalRecords = batchRecords.length;
    const batchSize = input.chunk_size || input.batchSize || 2000;
    const jobId = `batch_mig_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    await logJobStart(
      jobId,
      'migration-queue',
      'BATCH_MIGRATION',
      {
        totalRecords,
        batchSize,
        dryRun: input.dryRun,
        initiatedBy: adminId,
      }
    );

    const job = await addMigrationJob(
      'process-batch-migration',
      {
        migrationName: 'BULK_BATCH_MIGRATION',
        batchSize,
        dryRun: input.dryRun,
        metadata: {
          jobId,
          adminId,
          totalRecords,
          batches: batchRecords,
        },
      },
      { jobId }
    );

    processMigrationJob({
      migrationName: 'BULK_BATCH_MIGRATION',
      batchSize,
      dryRun: input.dryRun,
      metadata: {
        jobId,
        adminId,
        totalRecords,
        batches: batchRecords,
      },
    }).catch((err) => console.error(`[InlineMigration] Error processing batches batch ${jobId}:`, err));

    return {
      jobId,
      bullJobId: job.id,
      totalRecords,
      batchSize,
      dryRun: input.dryRun,
      status: 'processing',
      statusUrl: `/v1/admin/migrations/status/${jobId}`,
    };
  }

  /**
   * Queue & Process a Bulk Enrollment Migration Job
   */
  async queueEnrollmentMigration(input: BulkEnrollmentMigrationInput, adminId: string) {
    const enrollmentRecords = input.data || input.enrollments || [];
    const totalRecords = enrollmentRecords.length;
    const batchSize = input.chunk_size || input.batchSize || 2000;
    const jobId = `enroll_mig_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    await logJobStart(
      jobId,
      'migration-queue',
      'ENROLLMENT_MIGRATION',
      {
        totalRecords,
        batchSize,
        dryRun: input.dryRun,
        initiatedBy: adminId,
      }
    );

    const job = await addMigrationJob(
      'process-enrollment-migration',
      {
        migrationName: 'BULK_ENROLLMENT_MIGRATION',
        batchSize,
        dryRun: input.dryRun,
        metadata: {
          jobId,
          adminId,
          totalRecords,
          enrollments: enrollmentRecords,
        },
      },
      { jobId }
    );

    processMigrationJob({
      migrationName: 'BULK_ENROLLMENT_MIGRATION',
      batchSize,
      dryRun: input.dryRun,
      metadata: {
        jobId,
        adminId,
        totalRecords,
        enrollments: enrollmentRecords,
      },
    }).catch((err) => console.error(`[InlineMigration] Error processing enrollments batch ${jobId}:`, err));

    return {
      jobId,
      bullJobId: job.id,
      totalRecords,
      batchSize,
      dryRun: input.dryRun,
      status: 'processing',
      statusUrl: `/v1/admin/migrations/status/${jobId}`,
    };
  }

  /**
   * Queue & Process a Bulk Payment Migration Job
   */
  async queuePaymentMigration(input: BulkPaymentMigrationInput, adminId: string) {
    const paymentRecords = input.data || input.payments || [];
    const totalRecords = paymentRecords.length;
    const batchSize = input.chunk_size || input.batchSize || 2000;
    const jobId = `pay_mig_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    await logJobStart(
      jobId,
      'migration-queue',
      'PAYMENT_MIGRATION',
      {
        totalRecords,
        batchSize,
        dryRun: input.dryRun,
        initiatedBy: adminId,
      }
    );

    const job = await addMigrationJob(
      'process-payment-migration',
      {
        migrationName: 'BULK_PAYMENT_MIGRATION',
        batchSize,
        dryRun: input.dryRun,
        metadata: {
          jobId,
          adminId,
          totalRecords,
          payments: paymentRecords,
        },
      },
      { jobId }
    );

    processMigrationJob({
      migrationName: 'BULK_PAYMENT_MIGRATION',
      batchSize,
      dryRun: input.dryRun,
      metadata: {
        jobId,
        adminId,
        totalRecords,
        payments: paymentRecords,
      },
    }).catch((err) => console.error(`[InlineMigration] Error processing payments batch ${jobId}:`, err));

    return {
      jobId,
      bullJobId: job.id,
      totalRecords,
      batchSize,
      dryRun: input.dryRun,
      status: 'processing',
      statusUrl: `/v1/admin/migrations/status/${jobId}`,
    };
  }

  /**
   * Clear migration audit logs to reclaim disk space
   */
  async clearMigrationLogs() {
    await db.delete(jobAuditLogs).where(eq(jobAuditLogs.queueName, 'migration-queue'));
    return { success: true, message: 'Migration audit logs cleared successfully.' };
  }

  /**
   * Get live progress status, live PostgreSQL user counts, and recent audit logs
   */
  async getMigrationStatus(jobId?: string) {
    let targetJob: any = null;

    if (jobId && jobId !== 'latest') {
      targetJob = await migrationQueue.getJob(jobId);
    }

    if (!targetJob) {
      const activeJobs = await migrationQueue.getJobs(['active'], 0, 10);
      if (activeJobs.length > 0) {
        targetJob = activeJobs[0];
      } else {
        const waitingJobs = await migrationQueue.getJobs(['waiting'], 0, 10);
        if (waitingJobs.length > 0) {
          targetJob = waitingJobs[0];
        } else {
          const completedJobs = await migrationQueue.getJobs(['completed'], 0, 10);
          if (completedJobs.length > 0) {
            targetJob = completedJobs[completedJobs.length - 1];
          } else {
            const failedJobs = await migrationQueue.getJobs(['failed'], 0, 10);
            if (failedJobs.length > 0) {
              targetJob = failedJobs[failedJobs.length - 1];
            }
          }
        }
      }
    }

    // Fetch live PostgreSQL counts & recent audit logs concurrently
    const [queueCounts, dbStats, recentLogs] = await Promise.all([
      migrationQueue.getJobCounts('waiting', 'active', 'completed', 'failed'),
      (async () => {
        try {
          const [totalRes] = await db.select({ count: sql<number>`count(*)` }).from(users);
          const [adminRes] = await db.select({ count: sql<number>`count(*)` }).from(users).where(eq(users.role, 'admin'));
          const [studentRes] = await db.select({ count: sql<number>`count(*)` }).from(users).where(eq(users.role, 'student'));
          const [batchesRes] = await db.select({ count: sql<number>`count(*)` }).from(batches);
          const [enrollmentsRes] = await db.select({ count: sql<number>`count(*)` }).from(batchEnrollments);
          const [paymentsRes] = await db.select({ count: sql<number>`count(*)` }).from(batchEnrollmentPayments);
          return {
            totalUsersInDb: Number(totalRes?.count || 0),
            totalAdminsInDb: Number(adminRes?.count || 0),
            totalStudentsInDb: Number(studentRes?.count || 0),
            totalBatchesInDb: Number(batchesRes?.count || 0),
            totalEnrollmentsInDb: Number(enrollmentsRes?.count || 0),
            totalPaymentsInDb: Number(paymentsRes?.count || 0),
          };
        } catch {
          return { totalUsersInDb: 0, totalAdminsInDb: 0, totalStudentsInDb: 0, totalBatchesInDb: 0, totalEnrollmentsInDb: 0, totalPaymentsInDb: 0 };
        }
      })(),
      (async () => {
        try {
          return await db.select()
            .from(jobAuditLogs)
            .where(eq(jobAuditLogs.queueName, 'migration-queue'))
            .orderBy(desc(jobAuditLogs.createdAt))
            .limit(10);
        } catch {
          return [];
        }
      })(),
    ]);

    if (!targetJob) {
      return {
        jobId: 'none',
        name: 'No active migration jobs',
        state: 'idle',
        dbStats,
        queueCounts,
        recentLogs,
        progress: {
          processed: 0,
          total: 0,
          percentage: '0%',
          successCount: 0,
          failedCount: 0,
        },
        timestamp: null,
      };
    }

    const state = await targetJob.getState();
    const progressData = typeof targetJob.progress === 'object' ? targetJob.progress : { processed: 0, total: targetJob.data.metadata?.totalRecords || 0 };
    const total = targetJob.data.metadata?.totalRecords || 0;
    const processed = (progressData as any)?.processed || (state === 'completed' ? total : 0);
    const percentage = total > 0 ? ((processed / total) * 100).toFixed(1) + '%' : (state === 'completed' ? '100%' : '0%');

    return {
      jobId: targetJob.id,
      name: targetJob.name,
      state, // "queued" | "active" | "completed" | "failed"
      dbStats,
      queueCounts,
      recentLogs,
      progress: {
        processed,
        total,
        percentage,
        successCount: (progressData as any)?.successCount || (state === 'completed' ? total : 0),
        failedCount: (progressData as any)?.failedCount || 0,
      },
      failedReason: targetJob.failedReason || null,
      timestamp: targetJob.timestamp ? new Date(targetJob.timestamp).toISOString() : null,
      finishedOn: targetJob.finishedOn ? new Date(targetJob.finishedOn).toISOString() : null,
    };
  }
}

export const adminMigrationsService = new AdminMigrationsService();
