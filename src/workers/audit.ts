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
    }).onConflictDoNothing();
  } catch (err: any) {
    logger.error(`[Audit] Failed to log job start for ${jobId}: ${err.message}`);
  }
}

export async function logJobSuccess(jobId: string, result: any, durationMs: number) {
  try {
    const updated = await db.update(jobAuditLogs)
      .set({
        status: 'completed',
        result: result || {},
        durationMs,
        updatedAt: new Date(),
      })
      .where(eq(jobAuditLogs.jobId, jobId))
      .returning();

    // If no initial log row was present (e.g. created before audit tracking), insert completed record
    if (updated.length === 0) {
      await db.insert(jobAuditLogs).values({
        jobId,
        queueName: 'email-queue',
        jobName: result?.category || 'email-job',
        status: 'completed',
        result: result || {},
        durationMs,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  } catch (err: any) {
    logger.error(`[Audit] Failed to log job success for ${jobId}: ${err.message}`);
  }
}

export async function logJobFailure(jobId: string, error: Error, durationMs: number) {
  try {
    const updated = await db.update(jobAuditLogs)
      .set({
        status: 'failed',
        error: error.message || String(error),
        durationMs,
        updatedAt: new Date(),
      })
      .where(eq(jobAuditLogs.jobId, jobId))
      .returning();

    if (updated.length === 0) {
      await db.insert(jobAuditLogs).values({
        jobId,
        queueName: 'email-queue',
        jobName: 'email-job',
        status: 'failed',
        error: error.message || String(error),
        durationMs,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  } catch (err: any) {
    logger.error(`[Audit] Failed to log job failure for ${jobId}: ${err.message}`);
  }
}
