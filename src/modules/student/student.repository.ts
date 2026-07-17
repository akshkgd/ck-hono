import { db } from '../../db/index.js';
import { batchEnrollments, batches, batchSections, batchContent, contentLibrary, courseProgress, batchEnrollmentPayments, users } from '../../db/schema.js';
import { eq, and, asc, sql, desc } from 'drizzle-orm';

export class StudentRepository {
  public async findEnrolledCourses(userId: string) {
    return db
      .select({
        enrollmentId: batchEnrollments.id,
        batchId: batchEnrollments.batchId,
        status: batchEnrollments.status,
        progress: batchEnrollments.progress,
        timeSpentSeconds: batchEnrollments.timeSpentSeconds,
        paymentStatus: batchEnrollments.paymentStatus,
        enrolledAt: batchEnrollments.createdAt,
        paidAt: batchEnrollments.paidAt,
        accessTill: batchEnrollments.accessTill,
        courseStartDate: batches.startDate,
        amountPayable: batchEnrollments.amountPayable,
        amountPaid: batchEnrollments.amountPaid,
        batch: {
          name: batches.name,
          topic: batches.topic,
          type: batches.type,
          img: batches.img,
        }
      })
      .from(batchEnrollments)
      .innerJoin(batches, eq(batchEnrollments.batchId, batches.id))
      .where(and(
        eq(batchEnrollments.userId, userId),
        eq(batchEnrollments.paymentStatus, 'captured')
      ))
      .orderBy(batchEnrollments.createdAt);
  }

  public async findEnrollment(userId: string, batchId: number) {
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
        sequentialLearning: batchEnrollments.sequentialLearning,
        sequentialLearningWithAssignments: batchEnrollments.sequentialLearningWithAssignments,
      })
      .from(batchEnrollments)
      .innerJoin(batches, eq(batchEnrollments.batchId, batches.id))
      .where(and(
        eq(batchEnrollments.userId, userId),
        eq(batchEnrollments.batchId, batchId)
      ))
      .limit(1);
    return results[0];
  }

  public async getBatchSections(batchId: number) {
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

  public async getBatchContentWithProgress(batchId: number, userId: string, enrollmentId: number) {
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
      .leftJoin(
        courseProgress,
        and(
          eq(courseProgress.batchContentId, batchContent.id),
          eq(courseProgress.userId, userId),
          eq(courseProgress.enrollmentId, enrollmentId)
        )
      )
      .where(eq(batchContent.batchId, batchId))
      .orderBy(asc(batchContent.order));
  }

  public async getBatchContentAccessDetails(batchContentId: number, userId: string) {
    const results = await db
      .select({
        batchContentId: batchContent.id,
        batchId: batchContent.batchId,
        accessOn: batchContent.accessOn,
        accessTill: batchContent.accessTill,
        accessOnDate: batchContent.accessOnDate,
        accessTillDate: batchContent.accessTillDate,
        canSubmitAssignment: batchContent.canSubmitAssignment,
        videoDuration: contentLibrary.videoDuration,
        assignmentStatus: courseProgress.assignmentStatus,
        enrollment: {
          id: batchEnrollments.id,
          paymentStatus: batchEnrollments.paymentStatus,
          startedAt: batchEnrollments.startedAt,
          paidAt: batchEnrollments.paidAt,
          accessTill: batchEnrollments.accessTill,
          overrideAccessDays: batchEnrollments.overrideAccessDays,
          createdAt: batchEnrollments.createdAt,
          courseStartDate: batches.startDate,
          sequentialLearning: batchEnrollments.sequentialLearning,
          sequentialLearningWithAssignments: batchEnrollments.sequentialLearningWithAssignments,
        }
      })
      .from(batchContent)
      .innerJoin(batches, eq(batchContent.batchId, batches.id))
      .leftJoin(contentLibrary, eq(batchContent.contentId, contentLibrary.id))
      .leftJoin(
        batchEnrollments,
        and(
          eq(batchEnrollments.batchId, batchContent.batchId),
          eq(batchEnrollments.userId, userId)
        )
      )
      .leftJoin(
        courseProgress,
        and(
          eq(courseProgress.batchContentId, batchContent.id),
          eq(courseProgress.userId, userId)
        )
      )
      .where(eq(batchContent.id, batchContentId))
      .limit(1);
    return results[0];
  }

  public async upsertContentProgress(
    userId: string,
    enrollmentId: number,
    batchContentId: number,
    timeSpentDelta: number,
    progress: number,
    status: 'not_started' | 'learning' | 'completed',
    videoDuration?: number | null,
    canSubmitAssignment?: boolean | null,
    lastWatchedPosition?: number
  ) {
    const durationInSeconds = videoDuration && videoDuration < 100 ? videoDuration * 60 : videoDuration;

    const isCompletedOnInsert = progress >= 100 || status === 'completed' || (durationInSeconds && timeSpentDelta >= durationInSeconds * 0.9);
    const progressOnInsert = isCompletedOnInsert 
      ? 100 
      : (durationInSeconds 
          ? Math.min(100, Math.round((timeSpentDelta * 100) / durationInSeconds)) 
          : progress);
    const assignmentStatusOnInsert = (canSubmitAssignment && timeSpentDelta >= 600) ? 'pending' : null;

    const results = await db
      .insert(courseProgress)
      .values({
        userId,
        enrollmentId,
        batchContentId,
        timeSpent: timeSpentDelta,
        progress: progressOnInsert,
        status: isCompletedOnInsert ? 'completed' : 'learning',
        assignmentStatus: assignmentStatusOnInsert,
        lastWatchedPosition: lastWatchedPosition || 0,
      })
      .onConflictDoUpdate({
        target: [courseProgress.enrollmentId, courseProgress.batchContentId],
        set: {
          timeSpent: sql`${courseProgress.timeSpent} + ${timeSpentDelta}`,
          progress: durationInSeconds
            ? sql`CASE 
                WHEN ${courseProgress.timeSpent} + ${timeSpentDelta} >= ${durationInSeconds} * 0.9 THEN 100 
                ELSE GREATEST(${courseProgress.progress}, CAST(LEAST(100, ROUND((${courseProgress.timeSpent} + ${timeSpentDelta}) * 100.0 / ${durationInSeconds})) AS integer)) 
              END`
            : sql`GREATEST(${courseProgress.progress}, ${progress})`,
          status: durationInSeconds
            ? sql`CASE 
                WHEN ${courseProgress.timeSpent} + ${timeSpentDelta} >= ${durationInSeconds} * 0.9 OR GREATEST(${courseProgress.progress}, CAST(LEAST(100, ROUND((${courseProgress.timeSpent} + ${timeSpentDelta}) * 100.0 / ${durationInSeconds})) AS integer)) >= 100 OR ${status} = 'completed' THEN 'completed'::user_status 
                ELSE 'learning'::user_status 
              END`
            : sql`CASE 
                WHEN GREATEST(${courseProgress.progress}, ${progress}) >= 100 OR ${status} = 'completed' THEN 'completed'::user_status 
                ELSE 'learning'::user_status 
              END`,
          assignmentStatus: canSubmitAssignment
            ? sql`CASE 
                WHEN ${courseProgress.assignmentStatus} IS NULL AND ${courseProgress.timeSpent} + ${timeSpentDelta} >= 600 THEN 'pending'::assignment_status 
                ELSE ${courseProgress.assignmentStatus} 
              END`
            : courseProgress.assignmentStatus,
          lastWatchedPosition: lastWatchedPosition !== undefined ? lastWatchedPosition : courseProgress.lastWatchedPosition,
          updatedAt: new Date(),
        }
      })
      .returning();
    return results[0];
  }

  public async countBatchContents(batchId: number): Promise<number> {
    const results = await db
      .select({ count: sql<number>`cast(count(*) as integer)` })
      .from(batchContent)
      .where(eq(batchContent.batchId, batchId));
    return results[0]?.count || 0;
  }

  public async updateEnrollmentAggregates(enrollmentId: number, timeSpentDelta: number, totalContentCount: number) {
    await db
      .update(batchEnrollments)
      .set({
        timeSpentSeconds: sql`${batchEnrollments.timeSpentSeconds} + ${timeSpentDelta}`,
        progress: sql`(
          SELECT COALESCE(ROUND(SUM(${courseProgress.progress}) / ${totalContentCount}), 0)
          FROM ${courseProgress}
          WHERE ${courseProgress.enrollmentId} = ${enrollmentId}
        )`,
        updatedAt: new Date(),
      })
      .where(eq(batchEnrollments.id, enrollmentId));
  }

  public async upsertAssignmentSubmission(
    userId: string,
    enrollmentId: number,
    batchContentId: number,
    data: {
      githubLink?: string | null;
      deployedLink?: string | null;
      userRemark?: string | null;
      codeSubmitted?: string | null;
    }
  ) {
    const results = await db
      .insert(courseProgress)
      .values({
        userId,
        enrollmentId,
        batchContentId,
        timeSpent: 0,
        progress: 100,
        status: 'completed',
        githubLink: data.githubLink,
        deployedLink: data.deployedLink,
        userRemark: data.userRemark,
        codeSubmitted: data.codeSubmitted,
        assignmentStatus: 'submitted',
      })
      .onConflictDoUpdate({
        target: [courseProgress.enrollmentId, courseProgress.batchContentId],
        set: {
          progress: 100,
          status: 'completed',
          githubLink: data.githubLink,
          deployedLink: data.deployedLink,
          userRemark: data.userRemark,
          codeSubmitted: data.codeSubmitted,
          assignmentStatus: 'submitted',
          updatedAt: new Date(),
        }
      })
      .returning();
    return results[0];
  }

  public async getStudentPayments(userId: string) {
    return db
      .select({
        id: batchEnrollmentPayments.id,
        amount: batchEnrollmentPayments.amount,
        paidAt: batchEnrollmentPayments.paidAt,
        paymentMethod: batchEnrollmentPayments.paymentMethod,
        transactionId: batchEnrollmentPayments.transactionId,
        invoiceId: batchEnrollmentPayments.invoiceId,
        purpose: batchEnrollmentPayments.purpose,
        isGstApplicable: batchEnrollmentPayments.isGstApplicable,
        remarks: batchEnrollmentPayments.remarks,
        batchName: batches.name,
      })
      .from(batchEnrollmentPayments)
      .innerJoin(batchEnrollments, eq(batchEnrollmentPayments.batchEnrollmentId, batchEnrollments.id))
      .innerJoin(batches, eq(batchEnrollments.batchId, batches.id))
      .where(
        and(
          eq(batchEnrollments.userId, userId),
          eq(batchEnrollments.paymentStatus, 'captured')
        )
      )
      .orderBy(desc(batchEnrollmentPayments.paidAt));
  }

  public async updateUserProfile(userId: string, data: any) {
    const results = await db
      .update(users)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return results[0];
  }
}
