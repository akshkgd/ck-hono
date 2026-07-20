import { db } from '../db/index.js';
import { jobAuditLogs } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { logger } from '../utils/logger.js';

export async function logJobStart(jobId: string, queueName: string, jobName: string, payload: any) {
  try {
    await db.insert(jobAuditLogs).values({
      jobId,
      queueName,
      jobName,
      status: 'processing',
      payload: payload || {},
    });
  } catch (err: any) {
    logger.error(`[Audit] Failed to log job start for ${jobId}: ${err.message}`);
  }
}

export async function logJobSuccess(jobId: string, result: any, durationMs: number) {
  try {
    await db.update(jobAuditLogs)
      .set({
        status: 'completed',
        result: result || {},
        durationMs,
        updatedAt: new Date(),
      })
      .where(eq(jobAuditLogs.jobId, jobId));
  } catch (err: any) {
    logger.error(`[Audit] Failed to log job success for ${jobId}: ${err.message}`);
  }
}

export async function logJobFailure(jobId: string, error: Error, durationMs: number) {
  try {
    await db.update(jobAuditLogs)
      .set({
        status: 'failed',
        error: error.message || String(error),
        durationMs,
        updatedAt: new Date(),
      })
      .where(eq(jobAuditLogs.jobId, jobId));
  } catch (err: any) {
    logger.error(`[Audit] Failed to log job failure for ${jobId}: ${err.message}`);
  }
}
