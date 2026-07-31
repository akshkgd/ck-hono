import { AdminAssignmentsRepository } from './admin-assignments.repository.js';
import type { AssignmentsQueryInput, GradeAssignmentInput } from './admin-assignments.validation.js';
import { calculateDateRange } from '../../../utils/date-range.js';
import { db } from '../../../db/index.js';
import { users } from '../../../db/schema.js';
import { eq, sql } from 'drizzle-orm';

export class AdminAssignmentsService {
  private repository: AdminAssignmentsRepository;

  constructor() {
    this.repository = new AdminAssignmentsRepository();
  }

  public async getAssignmentsReport(input: AssignmentsQueryInput) {
    const { from: start, to: end } = calculateDateRange(
      input.timeRange as any,
      input.startDate || undefined,
      input.endDate || undefined
    );

    const limit = input.limit;
    const offset = (input.page - 1) * limit;

    const [submissions, totalCount] = await Promise.all([
      this.repository.getAssignmentsList(
        start,
        end,
        input.status || undefined,
        input.batchId || undefined,
        input.email || undefined,
        limit,
        offset,
        input.name || undefined
      ),
      this.repository.countAssignmentsTotal(
        start,
        end,
        input.status || undefined,
        input.batchId || undefined,
        input.email || undefined,
        input.name || undefined
      ),
    ]);

    return {
      submissions,
      pagination: {
        page: input.page,
        limit: input.limit,
        total: totalCount,
      }
    };
  }

  public async gradeSubmission(progressId: string, input: GradeAssignmentInput) {
    const result = await this.repository.findProgressById(progressId);
    if (!result) {
      throw new Error('Progress record not found');
    }

    const { progress, xp } = result;

    if (!progress.assignmentStatus) {
      throw new Error('Cannot grade a record that is not an assignment submission');
    }

    const updated = await this.repository.gradeAssignment(progressId, {
      assignmentStatus: input.assignmentStatus,
      teacherRemark: input.teacherRemark,
      videoFeedback: input.videoFeedback,
      codeSubmittedStatus: input.codeSubmittedStatus,
    });

    if (progress.assignmentStatus !== 'approved' && input.assignmentStatus === 'approved') {
      const xpToAward = xp || 50; // Fallback to 50 XP if not specified on the assignment content
      await db
        .update(users)
        .set({ xp: sql`${users.xp} + ${xpToAward}` })
        .where(eq(users.id, progress.userId));
    }

    return updated;
  }

  public async getEnrollmentAssignmentsReport(enrollmentId: string) {
    const report = await this.repository.getEnrollmentAssignments(enrollmentId);
    if (!report) {
      throw new Error('Enrollment not found');
    }
    return report;
  }

  public async getAssignmentSubmission(progressId: string) {
    const details = await this.repository.getAssignmentDetailsById(progressId);
    if (!details) {
      throw new Error('Assignment submission not found');
    }
    return details;
  }
}
