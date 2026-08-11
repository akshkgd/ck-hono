import { db } from '../../../db/index.js';
import { courseProgress, users, batchContent, batches, contentLibrary, batchEnrollments, batchSections } from '../../../db/schema.js';
import { eq, and, desc, asc, sql, ilike, inArray, or } from 'drizzle-orm';
import { APP_TIMEZONE } from '../../../utils/date-range.js';

export class AdminCourseProgressRepository {
  public async getProgressList(
    start: Date,
    end: Date,
    batchId?: string,
    email?: string,
    limit: number = 50,
    offset: number = 0,
    name?: string,
    q?: string
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
    if (q) {
      whereConditions.push(or(ilike(users.email, `%${q}%`), ilike(users.name, `%${q}%`))!);
    }

    return db
      .select({
        id: courseProgress.id,
        enrollmentId: courseProgress.enrollmentId,
        timeSpent: courseProgress.timeSpent,
        progress: courseProgress.progress,
        status: courseProgress.status,
        lastWatchedPosition: courseProgress.lastWatchedPosition,
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
    batchId?: string,
    email?: string,
    name?: string,
    q?: string
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
    if (q) {
      whereConditions.push(or(ilike(users.email, `%${q}%`), ilike(users.name, `%${q}%`))!);
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
    batchId?: string,
    email?: string,
    name?: string,
    q?: string
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
    if (q) {
      whereConditions.push(or(ilike(users.email, `%${q}%`), ilike(users.name, `%${q}%`))!);
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
    batchId?: string,
    email?: string,
    name?: string,
    q?: string
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
    if (q) {
      whereConditions.push(or(ilike(users.email, `%${q}%`), ilike(users.name, `%${q}%`))!);
    }

    const dayExpr = sql`(${courseProgress.updatedAt} AT TIME ZONE 'UTC') AT TIME ZONE ${sql.raw(`'${APP_TIMEZONE}'`)}`;
    const dateExpr = sql<string>`to_char(date_trunc('day', ${dayExpr}), 'YYYY-MM-DD')`;
    const groupExpr = sql`date_trunc('day', ${dayExpr})`;

    return db
      .select({
        date: dateExpr,
        usersCount: sql<number>`cast(count(distinct ${courseProgress.userId}) as integer)`,
        timeSpentSeconds: sql<number>`cast(sum(${courseProgress.timeSpent}) as integer)`,
        viewsCount: sql<number>`cast(count(${courseProgress.id}) as integer)`,
      })
      .from(courseProgress)
      .innerJoin(users, eq(courseProgress.userId, users.id))
      .innerJoin(batchContent, eq(courseProgress.batchContentId, batchContent.id))
      .where(and(...whereConditions))
      .groupBy(groupExpr)
      .orderBy(groupExpr);
  }

  public async getEnrollmentDetails(enrollmentId: string) {
    const results = await db
      .select({
        id: batchEnrollments.id,
        status: batchEnrollments.status,
        progress: batchEnrollments.progress,
        timeSpentSeconds: batchEnrollments.timeSpentSeconds,
        paymentStatus: batchEnrollments.paymentStatus,
        startedAt: batchEnrollments.startedAt,
        paidAt: batchEnrollments.paidAt,
        accessTill: batchEnrollments.accessTill,
        overrideAccessDays: batchEnrollments.overrideAccessDays,
        createdAt: batchEnrollments.createdAt,
        amountPayable: batchEnrollments.amountPayable,
        amountPaid: batchEnrollments.amountPaid,
        courseStartDate: batches.startDate,
        userId: batchEnrollments.userId,
        batch: {
          id: batches.id,
          name: batches.name,
          topic: batches.topic,
          description: batches.description,
          slug: batches.slug,
          startDate: batches.startDate,
          endDate: batches.endDate,
          img: batches.img,
        }
      })
      .from(batchEnrollments)
      .innerJoin(batches, eq(batchEnrollments.batchId, batches.id))
      .where(eq(batchEnrollments.id, enrollmentId))
      .limit(1);
    return results[0];
  }

  public async getBatchSections(batchId: string) {
    return db
      .select({
        id: batchSections.id,
        title: batchSections.title,
        order: batchSections.order,
      })
      .from(batchSections)
      .where(eq(batchSections.batchId, batchId))
      .orderBy(asc(batchSections.order));
  }

  public async getBatchContentWithProgress(batchId: string, userId: string, enrollmentId: string) {
    return db
      .select({
        id: batchContent.id,
        contentId: batchContent.contentId,
        sectionId: batchContent.sectionId,
        order: batchContent.order,
        accessOn: batchContent.accessOn,
        accessTill: batchContent.accessTill,
        accessOnDate: batchContent.accessOnDate,
        accessTillDate: batchContent.accessTillDate,
        canSubmitAssignment: batchContent.canSubmitAssignment,
        content: {
          id: contentLibrary.id,
          title: contentLibrary.title,
          desc: contentLibrary.desc,
          type: contentLibrary.type,
          contentType: contentLibrary.contentType,
          videoLink: contentLibrary.videoLink,
          videoDuration: contentLibrary.videoDuration,
          xp: contentLibrary.xp,
          assignment: contentLibrary.assignment,
          solutionCode: contentLibrary.solutionCode,
          hints: contentLibrary.hints,
        },
        progress: {
          status: courseProgress.status,
          timeSpent: courseProgress.timeSpent,
          progress: courseProgress.progress,
          lastWatchedPosition: courseProgress.lastWatchedPosition,
          githubLink: courseProgress.githubLink,
          deployedLink: courseProgress.deployedLink,
          assignmentStatus: courseProgress.assignmentStatus,
          userRemark: courseProgress.userRemark,
          teacherRemark: courseProgress.teacherRemark,
          videoFeedback: courseProgress.videoFeedback,
          codeSubmitted: courseProgress.codeSubmitted,
          codeSubmittedStatus: courseProgress.codeSubmittedStatus,
          updatedAt: courseProgress.updatedAt,
        }
      })
      .from(batchContent)
      .innerJoin(contentLibrary, eq(batchContent.contentId, contentLibrary.id))
      .leftJoin(batchSections, eq(batchContent.sectionId, batchSections.id))
      .leftJoin(
        courseProgress,
        and(
          eq(courseProgress.batchContentId, batchContent.id),
          eq(courseProgress.userId, userId),
          eq(courseProgress.enrollmentId, enrollmentId)
        )
      )
      .where(eq(batchContent.batchId, batchId))
      .orderBy(asc(batchSections.order), asc(batchContent.order));
  }

  public async resetSubmittedAssignmentsToPending(batchId?: string): Promise<number> {
    if (batchId) {
      const batchContentSubquery = db
        .select({ id: batchContent.id })
        .from(batchContent)
        .where(eq(batchContent.batchId, batchId));

      const result = await db
        .update(courseProgress)
        .set({
          assignmentStatus: 'pending',
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(courseProgress.assignmentStatus, 'submitted'),
            inArray(courseProgress.batchContentId, batchContentSubquery)
          )
        )
        .returning();

      return result.length;
    } else {
      const result = await db
        .update(courseProgress)
        .set({
          assignmentStatus: 'pending',
          updatedAt: new Date(),
        })
        .where(eq(courseProgress.assignmentStatus, 'submitted'))
        .returning();

      return result.length;
    }
  }

  public async bulkUpsertProgress(values: any[], tx: any = db) {
    if (values.length === 0) return;
    await tx
      .insert(courseProgress)
      .values(values)
      .onConflictDoUpdate({
        target: [courseProgress.enrollmentId, courseProgress.batchContentId],
        set: {
          timeSpent: sql`excluded.time_spent`,
          progress: sql`excluded.progress`,
          status: sql`excluded.status`,
          githubLink: sql`excluded.github_link`,
          deployedLink: sql`excluded.deployed_link`,
          assignmentStatus: sql`excluded.assignment_status`,
          updatedAt: sql`excluded.updated_at`,
        },
      });
  }

  public async getAggregateProgressForEnrollment(enrollmentId: string, tx: any = db) {
    const results = await tx
      .select({
        totalTimeSpent: sql<number>`cast(coalesce(sum(${courseProgress.timeSpent}), 0) as integer)`,
        totalProgressSum: sql<number>`cast(coalesce(sum(${courseProgress.progress}), 0) as integer)`,
      })
      .from(courseProgress)
      .where(eq(courseProgress.enrollmentId, enrollmentId));

    return results[0] || { totalTimeSpent: 0, totalProgressSum: 0 };
  }

  public async getBatchContentVideoDurations(batchContentIds: string[], tx: any = db) {
    if (batchContentIds.length === 0) return [];
    return tx
      .select({
        id: batchContent.id,
        videoDuration: contentLibrary.videoDuration,
      })
      .from(batchContent)
      .innerJoin(contentLibrary, eq(batchContent.contentId, contentLibrary.id))
      .where(inArray(batchContent.id, batchContentIds));
  }
}

