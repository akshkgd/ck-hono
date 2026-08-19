import { db } from '../../db/index.js';
import { batchEnrollments, batches, batchSections, batchContent, contentLibrary, courseProgress, batchEnrollmentPayments, users, batchLiveSessions } from '../../db/schema.js';
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

  public async findEnrollment(userId: string, batchId: string) {
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
        batchType: batches.type,
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

  public async getBatchLiveSessionsWithProgress(batchId: string, userId: string, enrollmentId: string) {
    return db
      .select({
        id: batchLiveSessions.id,
        batchId: batchLiveSessions.batchId,
        sectionId: batchLiveSessions.sectionId,
        topic: batchLiveSessions.topic,
        desc: batchLiveSessions.desc,
        time: batchLiveSessions.time,
        screenHlsVideo: batchLiveSessions.screenHlsVideo,
        faceHlsVideo: batchLiveSessions.faceHlsVideo,
        recordingHls: batchLiveSessions.recordingHls,
        order: batchLiveSessions.order,
        progress: {
          status: courseProgress.status,
          timeSpent: courseProgress.timeSpent,
          liveSessionTimeSpent: courseProgress.liveSessionTimeSpent,
          progress: courseProgress.progress,
          updatedAt: courseProgress.updatedAt,
        }
      })
      .from(batchLiveSessions)
      .leftJoin(
        courseProgress,
        and(
          eq(courseProgress.batchLiveSessionId, batchLiveSessions.id),
          eq(courseProgress.userId, userId),
          eq(courseProgress.enrollmentId, enrollmentId)
        )
      )
      .where(eq(batchLiveSessions.batchId, batchId))
      .orderBy(asc(batchLiveSessions.order));
  }

  public async getBatchContentAccessDetails(batchContentId: string, userId: string) {
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
        xp: contentLibrary.xp,
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
    enrollmentId: string,
    batchContentId: string,
    timeSpentDelta: number,
    progress: number,
    status: 'not_started' | 'learning' | 'completed',
    videoDuration?: number | null,
    canSubmitAssignment?: boolean | null,
    lastWatchedPosition?: number,
    xp?: number | null
  ) {
    const existing = await db
      .select({ id: courseProgress.id, status: courseProgress.status })
      .from(courseProgress)
      .where(and(
        eq(courseProgress.enrollmentId, enrollmentId),
        eq(courseProgress.batchContentId, batchContentId)
      ))
      .limit(1);

    const wasCompleted = existing.length > 0 && existing[0].status === 'completed';
    const hasRecord = existing.length > 0;

    if (!hasRecord && timeSpentDelta < 60 && status !== 'completed' && progress < 75) {
      return null;
    }

    const durationInSeconds = videoDuration && videoDuration < 100 ? videoDuration * 60 : videoDuration;

    const isCompletedOnInsert = progress >= 75 || status === 'completed' || (durationInSeconds ? timeSpentDelta >= durationInSeconds * 0.75 : false);
    const calculatedProgressFromTime = durationInSeconds ? Math.min(100, Math.round((timeSpentDelta * 100) / durationInSeconds)) : 0;
    const progressOnInsert = isCompletedOnInsert 
      ? 100 
      : Math.max(progress, calculatedProgressFromTime);
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
                WHEN GREATEST(${courseProgress.progress}, ${progress}) >= 75 OR ${status} = 'completed' OR ${courseProgress.timeSpent} + ${timeSpentDelta} >= ${durationInSeconds} * 0.75 THEN 100 
                ELSE CAST(LEAST(100, GREATEST(${courseProgress.progress}, ${progress}, ROUND((${courseProgress.timeSpent} + ${timeSpentDelta}) * 100.0 / ${durationInSeconds}))) AS integer) 
              END`
            : sql`CASE 
                WHEN GREATEST(${courseProgress.progress}, ${progress}) >= 75 OR ${status} = 'completed' THEN 100
                ELSE GREATEST(${courseProgress.progress}, ${progress})
              END`,
          status: durationInSeconds
            ? sql`CASE 
                WHEN GREATEST(${courseProgress.progress}, ${progress}) >= 75 OR ${status} = 'completed' OR ${courseProgress.timeSpent} + ${timeSpentDelta} >= ${durationInSeconds} * 0.75 OR CAST(LEAST(100, ROUND((${courseProgress.timeSpent} + ${timeSpentDelta}) * 100.0 / ${durationInSeconds})) AS integer) >= 75 THEN 'completed'::user_status 
                ELSE 'learning'::user_status 
              END`
            : sql`CASE 
                WHEN GREATEST(${courseProgress.progress}, ${progress}) >= 75 OR ${status} = 'completed' THEN 'completed'::user_status 
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

    const progressRecord = results[0];

    // Award XP on transition to completed
    if (progressRecord && !wasCompleted && progressRecord.status === 'completed' && xp) {
      await db
        .update(users)
        .set({ xp: sql`${users.xp} + ${xp}` })
        .where(eq(users.id, userId));
    }

    return progressRecord;
  }

  public async countBatchContents(batchId: string): Promise<number> {
    const results = await db
      .select({ count: sql<number>`cast(count(*) as integer)` })
      .from(batchContent)
      .where(eq(batchContent.batchId, batchId));
    return results[0]?.count || 0;
  }

  public async updateEnrollmentAggregates(enrollmentId: string, timeSpentDelta: number, totalContentCount: number) {
    await db
      .update(batchEnrollments)
      .set({
        timeSpentSeconds: sql`${batchEnrollments.timeSpentSeconds} + ${timeSpentDelta}`,
        progress: sql`(
          SELECT LEAST(100, COALESCE(ROUND(SUM(${courseProgress.progress}) * 1.0 / ${totalContentCount}), 0))
          FROM ${courseProgress}
          WHERE ${courseProgress.enrollmentId} = ${enrollmentId}
        )`,
        updatedAt: new Date(),
      })
      .where(eq(batchEnrollments.id, enrollmentId));
  }

  public async upsertAssignmentSubmission(
    userId: string,
    enrollmentId: string,
    batchContentId: string,
    data: {
      githubLink?: string | null;
      deployedLink?: string | null;
      userRemark?: string | null;
      codeSubmitted?: string | null;
    }
  ) {
    const existing = await db
      .select({ id: courseProgress.id, assignmentStatus: courseProgress.assignmentStatus })
      .from(courseProgress)
      .where(and(
        eq(courseProgress.enrollmentId, enrollmentId),
        eq(courseProgress.batchContentId, batchContentId)
      ))
      .limit(1);

    const wasSubmitted = existing.length > 0 && 
      (existing[0].assignmentStatus === 'submitted' || 
       existing[0].assignmentStatus === 'under review' || 
       existing[0].assignmentStatus === 'approved' || 
       existing[0].assignmentStatus === 'rejected');

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

    // Award 20 XP on initial assignment submission
    if (!wasSubmitted) {
      await db
        .update(users)
        .set({ xp: sql`${users.xp} + 20` })
        .where(eq(users.id, userId));
    }

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
