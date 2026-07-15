import { db } from '../../../db/index.js';
import { courseProgress, users, batchContent, batches, contentLibrary, batchEnrollments } from '../../../db/schema.js';
import { eq, and, desc, sql, ilike, isNotNull } from 'drizzle-orm';

export class AdminAssignmentsRepository {
  public async getAssignmentsList(
    start: Date,
    end: Date,
    status?: 'pending' | 'submitted' | 'under review' | 'approved' | 'rejected',
    batchId?: number,
    email?: string,
    limit: number = 50,
    offset: number = 0,
    name?: string
  ) {
    const whereConditions = [
      sql`${courseProgress.updatedAt} >= ${start}`,
      sql`${courseProgress.updatedAt} <= ${end}`,
      isNotNull(courseProgress.assignmentStatus), // Only return progress records that are assignments
    ];

    if (status) {
      whereConditions.push(eq(courseProgress.assignmentStatus, status));
    }
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

  public async countAssignmentsTotal(
    start: Date,
    end: Date,
    status?: 'pending' | 'submitted' | 'under review' | 'approved' | 'rejected',
    batchId?: number,
    email?: string,
    name?: string
  ): Promise<number> {
    const whereConditions = [
      sql`${courseProgress.updatedAt} >= ${start}`,
      sql`${courseProgress.updatedAt} <= ${end}`,
      isNotNull(courseProgress.assignmentStatus),
    ];

    if (status) {
      whereConditions.push(eq(courseProgress.assignmentStatus, status));
    }
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

  public async gradeAssignment(
    progressId: number,
    data: {
      assignmentStatus: 'pending' | 'submitted' | 'under review' | 'approved' | 'rejected';
      teacherRemark?: string | null;
      videoFeedback?: string | null;
      codeSubmittedStatus?: 'Accepted' | 'rejected' | 'attempted' | null;
    }
  ) {
    const results = await db
      .update(courseProgress)
      .set({
        assignmentStatus: data.assignmentStatus,
        teacherRemark: data.teacherRemark,
        videoFeedback: data.videoFeedback,
        codeSubmittedStatus: data.codeSubmittedStatus,
        updatedAt: new Date(),
      })
      .where(eq(courseProgress.id, progressId))
      .returning();
    return results[0] || null;
  }

  public async findProgressById(progressId: number) {
    const results = await db
      .select()
      .from(courseProgress)
      .where(eq(courseProgress.id, progressId))
      .limit(1);
    return results[0] || null;
  }

  public async getEnrollmentAssignments(enrollmentId: number) {
    const results = await db
      .select({
        enrollmentId: batchEnrollments.id,
        paidAt: batchEnrollments.paidAt,
        startedAt: batchEnrollments.startedAt,
        createdAt: batchEnrollments.createdAt,
        batchName: batches.name,
        progressId: courseProgress.id,
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
        content: {
          id: contentLibrary.id,
          title: contentLibrary.title,
          type: contentLibrary.type,
        }
      })
      .from(batchEnrollments)
      .innerJoin(batches, eq(batchEnrollments.batchId, batches.id))
      .leftJoin(
        courseProgress,
        and(
          eq(courseProgress.enrollmentId, batchEnrollments.id),
          isNotNull(courseProgress.assignmentStatus)
        )
      )
      .leftJoin(batchContent, eq(courseProgress.batchContentId, batchContent.id))
      .leftJoin(contentLibrary, eq(batchContent.contentId, contentLibrary.id))
      .where(eq(batchEnrollments.id, enrollmentId))
      .orderBy(desc(courseProgress.updatedAt));

    if (results.length === 0) {
      return null;
    }

    const first = results[0];
    const assignments = results
      .filter(row => row.progressId !== null)
      .map(row => ({
        id: row.progressId,
        timeSpent: row.timeSpent,
        progress: row.progress,
        status: row.status,
        githubLink: row.githubLink,
        deployedLink: row.deployedLink,
        assignmentStatus: row.assignmentStatus,
        userRemark: row.userRemark,
        teacherRemark: row.teacherRemark,
        videoFeedback: row.videoFeedback,
        codeSubmitted: row.codeSubmitted,
        codeSubmittedStatus: row.codeSubmittedStatus,
        updatedAt: row.updatedAt,
        content: row.content,
      }));

    return {
      batchName: first.batchName,
      enrollment: {
        id: first.enrollmentId,
        paidAt: first.paidAt,
        startedAt: first.startedAt || first.paidAt || first.createdAt,
      },
      assignments,
    };
  }
}
