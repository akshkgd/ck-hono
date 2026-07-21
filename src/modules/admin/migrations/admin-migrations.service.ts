import { addMigrationJob, migrationQueue } from '../../../queues/index.js';
import { BulkUserMigrationInput } from './admin-migrations.validation.js';
import { logJobStart } from '../../../workers/audit.js';

export class AdminMigrationsService {
  /**
   * Queue a 10 Lakh (1 Million) Bulk User Migration Job in BullMQ
   */
  async queueUserMigration(input: BulkUserMigrationInput, adminId: string) {
    const userRecords = input.data || input.users || [];
    const totalRecords = userRecords.length;
    const batchSize = input.chunk_size || input.batchSize || 2000;
    const jobId = `user_mig_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    // Create initial audit log entry
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

    return {
      jobId,
      bullJobId: job.id,
      totalRecords,
      batchSize,
      dryRun: input.dryRun,
      status: 'queued',
      statusUrl: `/v1/admin/migrations/status/${jobId}`,
    };
  }

  /**
   * Get live progress status of a running migration job
   */
  async getMigrationStatus(jobId: string) {
    const job = await migrationQueue.getJob(jobId);

    if (!job) {
      return null;
    }

    const state = await job.getState();
    const progressData = typeof job.progress === 'object' ? job.progress : { processed: 0, total: job.data.metadata?.totalRecords || 0 };
    const total = job.data.metadata?.totalRecords || 0;
    const processed = (progressData as any)?.processed || 0;
    const percentage = total > 0 ? ((processed / total) * 100).toFixed(1) + '%' : '0%';

    return {
      jobId: job.id,
      name: job.name,
      state, // "queued" | "active" | "completed" | "failed"
      progress: {
        processed,
        total,
        percentage,
        successCount: (progressData as any)?.successCount || 0,
        failedCount: (progressData as any)?.failedCount || 0,
      },
      failedReason: job.failedReason || null,
      timestamp: job.timestamp ? new Date(job.timestamp).toISOString() : null,
      finishedOn: job.finishedOn ? new Date(job.finishedOn).toISOString() : null,
    };
  }
}

export const adminMigrationsService = new AdminMigrationsService();
