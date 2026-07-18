import { AdminAssignmentsRepository } from './admin-assignments.repository.js';
import type { AssignmentsQueryInput, GradeAssignmentInput } from './admin-assignments.validation.js';
import { calculateDateRange } from '../../../utils/date-range.js';

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
        input.batchId,
        input.email || undefined,
        limit,
        offset,
        input.name || undefined
      ),
      this.repository.countAssignmentsTotal(
        start,
        end,
        input.status || undefined,
        input.batchId,
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

  public async gradeSubmission(progressId: number, input: GradeAssignmentInput) {
    const progress = await this.repository.findProgressById(progressId);
    if (!progress) {
      throw new Error('Progress record not found');
    }

    if (!progress.assignmentStatus) {
      throw new Error('Cannot grade a record that is not an assignment submission');
    }

    const updated = await this.repository.gradeAssignment(progressId, {
      assignmentStatus: input.assignmentStatus,
      teacherRemark: input.teacherRemark,
      videoFeedback: input.videoFeedback,
      codeSubmittedStatus: input.codeSubmittedStatus,
    });

    return updated;
  }



  public async getEnrollmentAssignmentsReport(enrollmentId: number) {
    const report = await this.repository.getEnrollmentAssignments(enrollmentId);
    if (!report) {
      throw new Error('Enrollment not found');
    }
    return report;
  }

  public async getAssignmentSubmission(progressId: number) {
    const details = await this.repository.getAssignmentDetailsById(progressId);
    if (!details) {
      throw new Error('Assignment submission not found');
    }
    return details;
  }
}
