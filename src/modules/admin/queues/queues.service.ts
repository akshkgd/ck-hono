import { emailQueue, crawlerQueue, migrationQueue, addEmailJob, addCrawlerJob, addMigrationJob, EmailJobData, CrawlerJobData, MigrationJobData } from '../../../queues/index.js';
import { db } from '../../../db/index.js';
import { jobAuditLogs } from '../../../db/schema.js';
import { desc, eq } from 'drizzle-orm';

export class AdminQueuesService {
  static async enqueueEmail(data: EmailJobData) {
    const job = await addEmailJob('send-email', data);
    return { jobId: job.id, queue: 'email-queue', status: 'queued' };
  }

  static async enqueueCrawler(data: CrawlerJobData) {
    const job = await addCrawlerJob('scrape-target', data, {
      jobId: `crawler-${Buffer.from(data.url).toString('base64url')}-${Date.now()}`,
    });
    return { jobId: job.id, queue: 'crawler-queue', status: 'queued' };
  }

  static async enqueueMigration(data: MigrationJobData) {
    const job = await addMigrationJob('run-migration', data);
    return { jobId: job.id, queue: 'migration-queue', status: 'queued' };
  }

  static async getQueueMetrics() {
    const [emailCounts, crawlerCounts, migrationCounts] = await Promise.all([
      emailQueue.getJobCounts('waiting', 'active', 'completed', 'failed', 'delayed'),
      crawlerQueue.getJobCounts('waiting', 'active', 'completed', 'failed', 'delayed'),
      migrationQueue.getJobCounts('waiting', 'active', 'completed', 'failed', 'delayed'),
    ]);

    return {
      emailQueue: emailCounts,
      crawlerQueue: crawlerCounts,
      migrationQueue: migrationCounts,
    };
  }

  static async getJobLogs(limit = 50, queueName?: string) {
    let query = db.select().from(jobAuditLogs).orderBy(desc(jobAuditLogs.createdAt)).limit(limit);

    if (queueName) {
      return db.select()
        .from(jobAuditLogs)
        .where(eq(jobAuditLogs.queueName, queueName))
        .orderBy(desc(jobAuditLogs.createdAt))
        .limit(limit);
    }

    return query;
  }
}
