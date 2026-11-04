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

export interface BackfillOptions {
  /** When true (default for callers), nothing is written; only the differences are reported. */
  dryRun: boolean;
  /** Restrict to a single enrollment (useful to try the repair on one student first). */
  enrollmentId?: string | null;
  /** Restrict to every enrollment of one batch. */
  batchId?: string | null;
  /** How many of the largest differences to return. */
  sampleSize?: number;
}

export interface BackfillResult {
  dryRun: boolean;
  totalEnrollments: number;
  mismatched: number;
  timeWasHigher: number;
  timeWasLower: number;
  updated: number;
  largestDifferences: Array<{
    enrollmentId: string;
    currentTimeSpentSeconds: number;
    newTimeSpentSeconds: number;
    currentProgress: number;
    newProgress: number;
  }>;
}

/**
 * One-off repair: re-derives time_spent_seconds and progress for existing
 * enrollments from their course_progress rows, using the exact same formula as
 * recalculateEnrollmentAggregates. Only enrollments whose stored values differ
 * are written, so re-running it is a no-op once everything matches.
 *
 * It cannot recover time that was never stored (dropped short pings, lost final
 * pings) and does not touch the course_progress rows themselves.
 */
export async function backfillEnrollmentAggregates(
  executor: DbExecutor,
  options: BackfillOptions
): Promise<BackfillResult> {
  const sampleSize = options.sampleSize ?? 25;
  const conditions = [sql`TRUE`];
  if (options.enrollmentId) conditions.push(sql`e.id = ${options.enrollmentId}::uuid`);
  if (options.batchId) conditions.push(sql`e.batch_id = ${options.batchId}::uuid`);
  const filter = sql.join(conditions, sql` AND `);

  const expected = sql`
    WITH content_totals AS (
      SELECT batch_id, count(*)::numeric AS total FROM batch_content GROUP BY batch_id
    ),
    expected AS (
      SELECT
        e.id,
        e.time_spent_seconds AS cur_time,
        e.progress AS cur_progress,
        COALESCE((SELECT SUM(cp.time_spent) FROM course_progress cp WHERE cp.enrollment_id = e.id), 0)::integer AS new_time,
        CASE
          WHEN COALESCE(ct.total, 0) > 0 THEN LEAST(100, COALESCE(ROUND(
            (SELECT SUM(cp.progress) FROM course_progress cp WHERE cp.enrollment_id = e.id AND cp.batch_content_id IS NOT NULL) * 1.0 / ct.total
          ), 0))::integer
          ELSE 0
        END AS new_progress
      FROM batch_enrollments e
      LEFT JOIN content_totals ct ON ct.batch_id = e.batch_id
      WHERE ${filter}
    )
  `;

  const summary = await executor.execute(sql`
    ${expected}
    SELECT
      count(*)::int AS total_enrollments,
      count(*) FILTER (WHERE cur_time <> new_time OR cur_progress <> new_progress)::int AS mismatched,
      count(*) FILTER (WHERE cur_time > new_time)::int AS time_was_higher,
      count(*) FILTER (WHERE cur_time < new_time)::int AS time_was_lower
    FROM expected
  `);

  const sample = await executor.execute(sql`
    ${expected}
    SELECT id, cur_time, new_time, cur_progress, new_progress
    FROM expected
    WHERE cur_time <> new_time OR cur_progress <> new_progress
    ORDER BY abs(cur_time - new_time) DESC
    LIMIT ${sampleSize}
  `);

  let updated = 0;
  if (!options.dryRun) {
    const result = await executor.execute(sql`
      ${expected}
      UPDATE batch_enrollments e
      SET time_spent_seconds = x.new_time,
          progress = x.new_progress,
          updated_at = now()
      FROM expected x
      WHERE e.id = x.id
        AND (x.cur_time <> x.new_time OR x.cur_progress <> x.new_progress)
    `);
    updated = result.rowCount ?? 0;
  }

  const row = summary.rows[0] as Record<string, number>;
  return {
    dryRun: options.dryRun,
    totalEnrollments: Number(row.total_enrollments ?? 0),
    mismatched: Number(row.mismatched ?? 0),
    timeWasHigher: Number(row.time_was_higher ?? 0),
    timeWasLower: Number(row.time_was_lower ?? 0),
    updated,
    largestDifferences: (sample.rows as Array<Record<string, any>>).map((r) => ({
      enrollmentId: r.id,
      currentTimeSpentSeconds: Number(r.cur_time),
      newTimeSpentSeconds: Number(r.new_time),
      currentProgress: Number(r.cur_progress),
      newProgress: Number(r.new_progress),
    })),
  };
}
