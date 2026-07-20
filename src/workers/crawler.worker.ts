import { Worker, Job } from 'bullmq';
import { redisConnection } from '../queues/config.js';
import { processCrawlerJob } from '../jobs/crawler.job.js';
import { logJobStart, logJobSuccess, logJobFailure } from './audit.js';

export const crawlerWorker = new Worker(
  'crawler-queue',
  async (job: Job) => {
    const startTime = Date.now();
    await logJobStart(job.id || String(job.timestamp), 'crawler-queue', job.name, job.data);

    try {
      const result = await processCrawlerJob(job.data);
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
    concurrency: 2, // Low concurrency (RAM & CPU guarded for DO Droplet)
    lockDuration: 60000, // 60s lock time for heavy scraping
  }
);
