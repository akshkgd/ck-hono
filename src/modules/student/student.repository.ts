import { db } from '../../db/index.js';
import { batchEnrollments, batches, batchSections, batchContent, contentLibrary, courseProgress, batchEnrollmentPayments, users, batchLiveSessions } from '../../db/schema.js';
import { eq, and, asc, sql, desc } from 'drizzle-orm';
import { recalculateEnrollmentAggregates, type DbExecutor } from '../enrollments/enrollment-aggregates.js';
import { computeTimeCredit, computeProgressState, normalizeVideoDurationSeconds, type ProgressStatus } from './video-progress.util.js';

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
        dummyCount: batchLiveSessions.dummyCount,
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
        videoLink: contentLibrary.videoLink,
        type: contentLibrary.type,
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

  public async getLiveSessionAccessDetails(liveSessionId: string, userId: string) {
    const results = await db
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
        dummyCount: batchLiveSessions.dummyCount,
        chapterName: batchSections.title,
        sectionTitle: batchSections.title,
        enrollment: {
          id: batchEnrollments.id,
          paymentStatus: batchEnrollments.paymentStatus,
          startedAt: batchEnrollments.startedAt,
          paidAt: batchEnrollments.paidAt,
          accessTill: batchEnrollments.accessTill,
          overrideAccessDays: batchEnrollments.overrideAccessDays,
          createdAt: batchEnrollments.createdAt,
          courseStartDate: batches.startDate,
        }
      })
      .from(batchLiveSessions)
      .innerJoin(batches, eq(batchLiveSessions.batchId, batches.id))
      .leftJoin(batchSections, eq(batchLiveSessions.sectionId, batchSections.id))
      .leftJoin(
        batchEnrollments,
        and(
          eq(batchEnrollments.batchId, batchLiveSessions.batchId),
          eq(batchEnrollments.userId, userId)
        )
      )
      .where(eq(batchLiveSessions.id, liveSessionId))
      .limit(1);
    return results[0];
  }

  /**
   * Records one video heartbeat atomically.
   *
   * Everything happens in one transaction under a row lock on the enrollment, so
   * concurrent heartbeats (multiple tabs, retries, pause + timer pings) are
   * applied one after another. Time is credited server-side (see
   * `computeTimeCredit`), the content row is written with explicit values,
   * the enrollment aggregates are re-derived from the rows, and XP is awarded
   * exactly once on the transition to completed.
   *
   * A row is always created on the first heartbeat, so short sessions and the
   * resume position are never dropped.
   */
  public async recordVideoHeartbeat(params: {
    userId: string;
    enrollmentId: string;
    batchId: string;
    batchContentId: string;
    /** Legacy client-reported delta (seconds); only used as an upper bound. */
    claimedTimeSpent?: number;
    progress: number;
    status: ProgressStatus;
    position?: number;
    videoDuration?: number | null;
    canSubmitAssignment?: boolean | null;
    xp?: number | null;
  }) {
    const durationSeconds = normalizeVideoDurationSeconds(params.videoDuration);

    return db.transaction(async (tx) => {
      // Serialise all heartbeats of this enrollment.
      await tx
        .select({ id: batchEnrollments.id })
        .from(batchEnrollments)
        .where(eq(batchEnrollments.id, params.enrollmentId))
        .for('update');

      const [existing] = await tx
        .select()
        .from(courseProgress)
        .where(and(
          eq(courseProgress.enrollmentId, params.enrollmentId),
          eq(courseProgress.batchContentId, params.batchContentId)
        ))
        .limit(1);

      const now = new Date();
      const credit = computeTimeCredit({
        claimedSeconds: params.claimedTimeSpent,
        now,
        lastPingAt: existing?.lastPingAt ?? null,
        position: params.position,
        lastPosition: existing ? existing.lastWatchedPosition : null,
      });

      const next = computeProgressState({
        prevTimeSpent: existing?.timeSpent ?? 0,
        prevProgress: existing?.progress ?? 0,
        prevStatus: existing?.status ?? null,
        creditedSeconds: credit,
        inputProgress: params.progress,
        inputStatus: params.status,
        durationSeconds,
      });

      const position = params.position ?? existing?.lastWatchedPosition ?? 0;
      const assignmentStatus =
        existing?.assignmentStatus ??
        (params.canSubmitAssignment && next.timeSpent >= 600 ? ('pending' as const) : null);

      let record: typeof courseProgress.$inferSelect;
      if (existing) {
        [record] = await tx
          .update(courseProgress)
          .set({
            timeSpent: next.timeSpent,
            progress: next.progress,
            status: next.status,
            assignmentStatus,
            lastWatchedPosition: position,
            lastPingAt: now,
            updatedAt: now,
          })
          .where(eq(courseProgress.id, existing.id))
          .returning();
      } else {
        [record] = await tx
          .insert(courseProgress)
          .values({
            userId: params.userId,
            enrollmentId: params.enrollmentId,
            batchContentId: params.batchContentId,
            timeSpent: next.timeSpent,
            progress: next.progress,
            status: next.status,
            assignmentStatus,
            lastWatchedPosition: position,
            lastPingAt: now,
          })
          .returning();
      }

      const aggregatesChanged =
        !existing ||
        credit > 0 ||
        existing.progress !== next.progress ||
        existing.status !== next.status;

      if (aggregatesChanged) {
        const totalContentCount = await this.countBatchContents(params.batchId, tx);
        await recalculateEnrollmentAggregates(tx, params.enrollmentId, totalContentCount);
      }

      // Award XP on the transition to completed (serialised by the enrollment lock).
      if (existing?.status !== 'completed' && next.status === 'completed' && params.xp) {
        await tx
          .update(users)
          .set({ xp: sql`${users.xp} + ${params.xp}` })
          .where(eq(users.id, params.userId));
      }

      return record;
    });
  }

  public async countBatchContents(batchId: string, executor: DbExecutor = db): Promise<number> {
    const results = await executor
      .select({ count: sql<number>`cast(count(*) as integer)` })
      .from(batchContent)
      .where(eq(batchContent.batchId, batchId));
    return results[0]?.count || 0;
  }

  /** Re-derives enrollment progress/time from the per-content rows. */
  public async updateEnrollmentAggregates(enrollmentId: string, totalContentCount: number) {
    await recalculateEnrollmentAggregates(db, enrollmentId, totalContentCount);
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
