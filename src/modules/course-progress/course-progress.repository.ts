import { db } from '../../db/index.js';
import { courseProgress } from '../../db/schema.js';
import { eq, and, sql } from 'drizzle-orm';

export type CourseProgress = typeof courseProgress.$inferSelect;
export type NewCourseProgress = typeof courseProgress.$inferInsert;

export class CourseProgressRepository {
  public async findByEnrollmentAndContent(enrollmentId: number, batchContentId: number): Promise<CourseProgress | null> {
    const results = await db
      .select()
      .from(courseProgress)
      .where(
        and(
          eq(courseProgress.enrollmentId, enrollmentId),
          eq(courseProgress.batchContentId, batchContentId)
        )
      )
      .limit(1);

    return results[0] || null;
  }

  public async upsertProgress(data: NewCourseProgress): Promise<CourseProgress> {
    const results = await db
      .insert(courseProgress)
      .values(data)
      .onConflictDoUpdate({
        target: [courseProgress.enrollmentId, courseProgress.batchContentId],
        set: {
          timeSpent: data.timeSpent,
          progress: data.progress,
          status: data.status,
          updatedAt: new Date(),
        }
      })
      .returning();

    return results[0];
  }

  public async getProgressForEnrollment(enrollmentId: number): Promise<CourseProgress[]> {
    return db
      .select()
      .from(courseProgress)
      .where(eq(courseProgress.enrollmentId, enrollmentId));
  }

  public async getAggregateProgressForEnrollment(enrollmentId: number) {
    const results = await db
      .select({
        totalTimeSpent: sql<number>`coalesce(sum(${courseProgress.timeSpent}), 0)`,
        totalProgressSum: sql<number>`coalesce(sum(${courseProgress.progress}), 0)`,
      })
      .from(courseProgress)
      .where(eq(courseProgress.enrollmentId, enrollmentId));

    return results[0] || { totalTimeSpent: 0, totalProgressSum: 0 };
  }
}
