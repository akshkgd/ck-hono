/**
 * Re-derives batch_enrollments.time_spent_seconds and progress from the per-content
 * course_progress rows (the same formula as recalculateEnrollmentAggregates).
 *
 * Fixes enrollments whose stored total drifted from the sum of their per-video times.
 * It cannot recover time that was never stored (dropped short pings, lost final pings).
 *
 * Usage:
 *   tsx scripts/recalculate-enrollment-aggregates.ts                 # dry run (default), prints diffs
 *   tsx scripts/recalculate-enrollment-aggregates.ts --apply         # write the changes
 *   tsx scripts/recalculate-enrollment-aggregates.ts --enrollment=<uuid> [--apply]
 */
import 'dotenv/config';
import { sql } from 'drizzle-orm';
import { db } from '../src/db/index.js';

const apply = process.argv.includes('--apply');
const enrollmentArg = process.argv.find((a) => a.startsWith('--enrollment='))?.split('=')[1];
const SAMPLE_SIZE = 25;

// Expected values per enrollment, computed exactly like the runtime helper.
const expectedCte = (filter: ReturnType<typeof sql>) => sql`
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

async function main() {
  const filter = enrollmentArg ? sql`e.id = ${enrollmentArg}::uuid` : sql`TRUE`;

  const summary = await db.execute(sql`
    ${expectedCte(filter)}
    SELECT
      count(*)::int AS total_enrollments,
      count(*) FILTER (WHERE cur_time <> new_time OR cur_progress <> new_progress)::int AS mismatched,
      count(*) FILTER (WHERE cur_time > new_time)::int AS time_was_higher,
      count(*) FILTER (WHERE cur_time < new_time)::int AS time_was_lower
    FROM expected
  `);
  console.log('Summary:', summary.rows[0]);

  const sample = await db.execute(sql`
    ${expectedCte(filter)}
    SELECT id, cur_time, new_time, cur_progress, new_progress
    FROM expected
    WHERE cur_time <> new_time OR cur_progress <> new_progress
    ORDER BY abs(cur_time - new_time) DESC
    LIMIT ${SAMPLE_SIZE}
  `);
  console.log(`Largest differences (up to ${SAMPLE_SIZE}):`);
  console.table(sample.rows);

  if (!apply) {
    console.log('Dry run only. Re-run with --apply to write these changes.');
    process.exit(0);
  }

  const result = await db.execute(sql`
    ${expectedCte(filter)}
    UPDATE batch_enrollments e
    SET time_spent_seconds = x.new_time,
        progress = x.new_progress,
        updated_at = now()
    FROM expected x
    WHERE e.id = x.id
      AND (x.cur_time <> x.new_time OR x.cur_progress <> x.new_progress)
  `);
  console.log(`Updated ${result.rowCount ?? 0} enrollment(s).`);
  process.exit(0);
}

main().catch((err) => {
  console.error('Recalculation failed:', err);
  process.exit(1);
});
