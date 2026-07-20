import { Worker, Job } from 'bullmq';
import { redisConnection } from '../queues/config.js';
import { processMigrationJob } from '../jobs/migration.job.js';
import { logJobStart, logJobSuccess, logJobFailure } from './audit.js';

export const migrationWorker = new Worker(
  'migration-queue',
  async (job: Job) => {
    const startTime = Date.now();
    await logJobStart(job.id || String(job.timestamp), 'migration-queue', job.name, job.data);

    try {
      const result = await processMigrationJob(job.data);
      const durationMs = Date.now() - startTime;
      await logJobSuccess(job.id || String(job.timestamp), result, durationMs);
      return result;
    } catch (err: any) {
      const durationMs = Date.now() - startTime;
      await logJobFailure(job.id || String(job.timestamp), err, durationMs);
      throw err;
    }
  },
  {
    connection: redisConnection,
    concurrency: 1, // MUST be 1 for strict sequential execution
    lockDuration: 300000, // 5 minute lock duration for background migrations
  }
);
