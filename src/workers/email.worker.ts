import { Worker, Job } from 'bullmq';
import { redisConnection } from '../queues/config.js';
import { processEmailJob } from '../jobs/email.job.js';
import { logJobStart, logJobSuccess, logJobFailure } from './audit.js';

export const emailWorker = new Worker(
  'email-queue',
  async (job: Job) => {
    const startTime = Date.now();
    await logJobStart(job.id || String(job.timestamp), 'email-queue', job.name, job.data);

    try {
      const result = await processEmailJob(job.data);
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
    concurrency: 15, // High concurrency for fast email dispatch
    limiter: {
      max: 50,      // Max 50 emails
      duration: 1000, // Per second rate limit
    },
  }
);
