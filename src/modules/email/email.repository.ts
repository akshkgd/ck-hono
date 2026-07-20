import { db } from '../../db/index.js';
import { jobAuditLogs } from '../../db/schema.js';
import { eq, desc, and } from 'drizzle-orm';

export class EmailRepository {
  /**
   * Fetch recent email job audit logs
   */
  async getEmailJobLogs(limit = 50, offset = 0) {
    return db.select()
      .from(jobAuditLogs)
      .where(eq(jobAuditLogs.queueName, 'email-queue'))
      .orderBy(desc(jobAuditLogs.createdAt))
      .limit(limit)
      .offset(offset);
  }

  /**
   * Fetch job log by job ID
   */
  async getJobLogById(jobId: string) {
    const logs = await db.select()
      .from(jobAuditLogs)
      .where(
        and(
          eq(jobAuditLogs.queueName, 'email-queue'),
          eq(jobAuditLogs.jobId, jobId)
        )
      )
      .limit(1);

    return logs[0] || null;
  }
}

export const emailRepository = new EmailRepository();
