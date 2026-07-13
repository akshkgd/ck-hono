import { db } from '../../../db/index.js';
import { courseProgress, users, batchContent, batches, contentLibrary } from '../../../db/schema.js';
import { eq, and, desc, sql, ilike } from 'drizzle-orm';

export class AdminCourseProgressRepository {
  public async getProgressList(
    start: Date,
    end: Date,
    batchId?: number,
    email?: string,
    limit: number = 50,
    offset: number = 0,
    name?: string
  ) {
    const whereConditions = [
      sql`${courseProgress.updatedAt} >= ${start}`,
      sql`${courseProgress.updatedAt} <= ${end}`,
    ];

    if (batchId) {
      whereConditions.push(eq(batchContent.batchId, batchId));
    }
    if (email) {
      whereConditions.push(ilike(users.email, `%${email}%`));
    }
    if (name) {
      whereConditions.push(ilike(users.name, `%${name}%`));
    }

    return db
      .select({
        id: courseProgress.id,
        timeSpent: courseProgress.timeSpent,
        progress: courseProgress.progress,
        status: courseProgress.status,
        githubLink: courseProgress.githubLink,
        deployedLink: courseProgress.deployedLink,
        assignmentStatus: courseProgress.assignmentStatus,
        userRemark: courseProgress.userRemark,
        teacherRemark: courseProgress.teacherRemark,
        videoFeedback: courseProgress.videoFeedback,
        codeSubmitted: courseProgress.codeSubmitted,
        codeSubmittedStatus: courseProgress.codeSubmittedStatus,
        updatedAt: courseProgress.updatedAt,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
        batch: {
          id: batches.id,
          name: batches.name,
        },
        content: {
          id: contentLibrary.id,
          title: contentLibrary.title,
          type: contentLibrary.type,
        }
      })
      .from(courseProgress)
      .innerJoin(users, eq(courseProgress.userId, users.id))
      .innerJoin(batchContent, eq(courseProgress.batchContentId, batchContent.id))
      .innerJoin(batches, eq(batchContent.batchId, batches.id))
      .innerJoin(contentLibrary, eq(batchContent.contentId, contentLibrary.id))
      .where(and(...whereConditions))
      .orderBy(desc(courseProgress.updatedAt))
      .limit(limit)
      .offset(offset);
  }

  public async countProgressTotal(
    start: Date,
    end: Date,
    batchId?: number,
    email?: string,
    name?: string
  ): Promise<number> {
    const whereConditions = [
      sql`${courseProgress.updatedAt} >= ${start}`,
      sql`${courseProgress.updatedAt} <= ${end}`,
    ];

    if (batchId) {
      whereConditions.push(eq(batchContent.batchId, batchId));
    }
    if (email) {
      whereConditions.push(ilike(users.email, `%${email}%`));
    }
    if (name) {
      whereConditions.push(ilike(users.name, `%${name}%`));
    }

    const results = await db
      .select({ count: sql<number>`cast(count(*) as integer)` })
      .from(courseProgress)
      .innerJoin(users, eq(courseProgress.userId, users.id))
      .innerJoin(batchContent, eq(courseProgress.batchContentId, batchContent.id))
      .where(and(...whereConditions));

    return results[0]?.count || 0;
  }

  public async getProgressAnalytics(
    start: Date,
    end: Date,
    batchId?: number,
    email?: string,
    name?: string
  ) {
    const whereConditions = [
      sql`${courseProgress.updatedAt} >= ${start}`,
      sql`${courseProgress.updatedAt} <= ${end}`,
    ];

    if (batchId) {
      whereConditions.push(eq(batchContent.batchId, batchId));
    }
    if (email) {
      whereConditions.push(ilike(users.email, `%${email}%`));
    }
    if (name) {
      whereConditions.push(ilike(users.name, `%${name}%`));
    }

    const results = await db
      .select({
        totalUsers: sql<number>`cast(count(distinct ${courseProgress.userId}) as integer)`,
        totalTimeSpent: sql<number>`cast(sum(${courseProgress.timeSpent}) as integer)`,
        totalViews: sql<number>`cast(count(${courseProgress.id}) as integer)`,
      })
      .from(courseProgress)
      .innerJoin(users, eq(courseProgress.userId, users.id))
      .innerJoin(batchContent, eq(courseProgress.batchContentId, batchContent.id))
      .where(and(...whereConditions));

    return results[0] || { totalUsers: 0, totalTimeSpent: 0, totalViews: 0 };
  }

  public async getDailyProgressAnalytics(
    start: Date,
    end: Date,
    batchId?: number,
    email?: string,
    name?: string
  ) {
    const whereConditions = [
      sql`${courseProgress.updatedAt} >= ${start}`,
      sql`${courseProgress.updatedAt} <= ${end}`,
    ];

    if (batchId) {
      whereConditions.push(eq(batchContent.batchId, batchId));
    }
    if (email) {
      whereConditions.push(ilike(users.email, `%${email}%`));
    }
    if (name) {
      whereConditions.push(ilike(users.name, `%${name}%`));
    }

    return db
      .select({
        date: sql<string>`to_char(date_trunc('day', ${courseProgress.updatedAt}), 'YYYY-MM-DD')`,
        usersCount: sql<number>`cast(count(distinct ${courseProgress.userId}) as integer)`,
        timeSpentSeconds: sql<number>`cast(sum(${courseProgress.timeSpent}) as integer)`,
        viewsCount: sql<number>`cast(count(${courseProgress.id}) as integer)`,
      })
      .from(courseProgress)
      .innerJoin(users, eq(courseProgress.userId, users.id))
      .innerJoin(batchContent, eq(courseProgress.batchContentId, batchContent.id))
      .where(and(...whereConditions))
      .groupBy(sql`date_trunc('day', ${courseProgress.updatedAt})`)
      .orderBy(sql`date_trunc('day', ${courseProgress.updatedAt})`);
  }
}
