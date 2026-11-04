import { db } from '../../db/index.js';
import { batchEnrollments, courseProgress } from '../../db/schema.js';
import { eq, sql } from 'drizzle-orm';

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];
export type DbExecutor = typeof db | Tx;

/**
 * Single source of truth for enrollment-level aggregates.
 *
 * `time_spent_seconds` and `progress` are always derived from the per-content
 * `course_progress` rows, never incremented independently, so the enrollment
 * total can't drift from the sum of the per-video times.
 *
 * Only rows tied to batch content count towards `progress` (live-session rows
 * have a null `batch_content_id`), matching the denominator `totalContentCount`.
 */
export async function recalculateEnrollmentAggregates(
  executor: DbExecutor,
  enrollmentId: string,
  totalContentCount: number
): Promise<void> {
  await executor
    .update(batchEnrollments)
    .set({
      timeSpentSeconds: sql`(
        SELECT COALESCE(SUM(${courseProgress.timeSpent}), 0)::integer
        FROM ${courseProgress}
        WHERE ${courseProgress.enrollmentId} = ${enrollmentId}
      )`,
      progress: sql`(
        SELECT CASE
          WHEN ${totalContentCount}::numeric > 0 THEN LEAST(100, COALESCE(ROUND(SUM(${courseProgress.progress}) * 1.0 / ${totalContentCount}::numeric), 0))::integer
          ELSE 0
        END
        FROM ${courseProgress}
        WHERE ${courseProgress.enrollmentId} = ${enrollmentId}
          AND ${courseProgress.batchContentId} IS NOT NULL
      )`,
      updatedAt: new Date(),
    })
    .where(eq(batchEnrollments.id, enrollmentId));
}
