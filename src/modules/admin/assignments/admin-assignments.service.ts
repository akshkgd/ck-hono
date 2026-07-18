import { AdminAssignmentsRepository } from './admin-assignments.repository.js';
import type { AssignmentsQueryInput, GradeAssignmentInput } from './admin-assignments.validation.js';

export class AdminAssignmentsService {
  private repository: AdminAssignmentsRepository;

  constructor() {
    this.repository = new AdminAssignmentsRepository();
  }

  public async getAssignmentsReport(input: AssignmentsQueryInput) {
    const { start, end } = this.getDateRange(
      input.timeRange,
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

  private getDateRange(timeRange: string, customStart?: string, customEnd?: string): { start: Date; end: Date } {
    const now = new Date();
    let start = new Date();
    let end = new Date();

    const startOfDay = (d: Date) => {
      d.setHours(0, 0, 0, 0);
      return d;
    };

    const endOfDay = (d: Date) => {
      d.setHours(23, 59, 59, 999);
      return d;
    };

    switch (timeRange) {
      case 'today':
        start = startOfDay(new Date());
        end = endOfDay(new Date());
        break;
      case 'yesterday':
        start = startOfDay(new Date());
        start.setDate(start.getDate() - 1);
        end = endOfDay(new Date());
        end.setDate(end.getDate() - 1);
        break;
      case 'this_week': {
        const day = now.getDay();
        const diff = now.getDate() - day + (day === 0 ? -6 : 1);
        start = startOfDay(new Date(now.setDate(diff)));
        end = endOfDay(new Date());
        break;
      }
      case 'last_week': {
        const day = now.getDay();
        const diff = now.getDate() - day + (day === 0 ? -6 : 1) - 7;
        start = startOfDay(new Date(now.setDate(diff)));
        end = endOfDay(new Date(start));
        end.setDate(end.getDate() + 6);
        break;
      }
      case 'this_month':
        start = startOfDay(new Date(now.getFullYear(), now.getMonth(), 1));
        end = endOfDay(new Date());
        break;
      case 'last_month':
        start = startOfDay(new Date(now.getFullYear(), now.getMonth() - 1, 1));
        end = endOfDay(new Date(now.getFullYear(), now.getMonth(), 0));
        break;
      case 'custom':
        if (customStart && customEnd) {
          start = startOfDay(new Date(customStart));
          end = endOfDay(new Date(customEnd));
        }
        break;
    }

    return { start, end };
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
