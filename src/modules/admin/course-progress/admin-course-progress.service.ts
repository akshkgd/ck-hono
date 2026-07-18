import { AdminCourseProgressRepository } from './admin-course-progress.repository.js';
import type { ProgressQueryInput } from './admin-course-progress.validation.js';
import { calculateDateRange } from '../../../utils/date-range.js';

export class AdminCourseProgressService {
  private repository: AdminCourseProgressRepository;

  constructor() {
    this.repository = new AdminCourseProgressRepository();
  }

  public async getProgressReport(input: ProgressQueryInput) {
    const { from: start, to: end } = calculateDateRange(
      input.timeRange as any,
      input.startDate || undefined,
      input.endDate || undefined
    );

    const limit = input.limit;
    const offset = (input.page - 1) * limit;

    // Fetch progress list, totals, summary analytics, and daily breakdown in parallel
    const [logs, totalCount, analytics, chartData] = await Promise.all([
      this.repository.getProgressList(start, end, input.batchId, input.email || undefined, limit, offset, input.name || undefined),
      this.repository.countProgressTotal(start, end, input.batchId, input.email || undefined, input.name || undefined),
      this.repository.getProgressAnalytics(start, end, input.batchId, input.email || undefined, input.name || undefined),
      this.repository.getDailyProgressAnalytics(start, end, input.batchId, input.email || undefined, input.name || undefined),
    ]);

    // Calculate number of calendar days in the selected range to get a true daily average
    const oneDayMs = 24 * 60 * 60 * 1000;
    const diffDays = Math.max(1, Math.round(Math.abs((end.getTime() - start.getTime()) / oneDayMs)));
    const dailyAverageTimeSpentSeconds = Math.round(analytics.totalTimeSpent / diffDays);

    return {
      analytics: {
        totalUsers: analytics.totalUsers,
        totalTimeSpentSeconds: analytics.totalTimeSpent,
        dailyAverageTimeSpentSeconds,
        totalViews: analytics.totalViews,
      },
      chartData,
      progressLogs: logs,
      pagination: {
        page: input.page,
        limit: input.limit,
        total: totalCount,
      }
    };
  }



  public async getEnrollmentBatchProgress(enrollmentId: number) {
    const enrollment = await this.repository.getEnrollmentDetails(enrollmentId);
    if (!enrollment) {
      throw new Error('Enrollment not found');
    }

    const { courseStartDate, batch, userId, ...enrollmentDetails } = enrollment;
    const now = new Date();
    const startDate = new Date(courseStartDate);
    const endDate = batch.endDate ? new Date(batch.endDate) : new Date();

    const diffTime = now.getTime() - startDate.getTime();
    const calculatedDaysPassed = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const daysPassed = enrollmentDetails.overrideAccessDays !== null && enrollmentDetails.overrideAccessDays !== undefined && enrollmentDetails.overrideAccessDays > 0
      ? Math.max(calculatedDaysPassed, enrollmentDetails.overrideAccessDays)
      : calculatedDaysPassed;

    const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endDateMidnight = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
    const isAccessActive = todayMidnight.getTime() <= endDateMidnight.getTime();

    // Fetch sections and content in parallel
    const [sections, contents] = await Promise.all([
      this.repository.getBatchSections(batch.id),
      this.repository.getBatchContentWithProgress(batch.id, userId, enrollment.id),
    ]);

    // Map content items to their corresponding sections
    const sectionsMap = new Map<number, any[]>();
    for (const section of sections) {
      sectionsMap.set(section.id, []);
    }

    const unassignedContents: any[] = [];

    for (const item of contents) {
      const progressStatus = item.progress?.status || 'not_started';
      const itemMapped = {
        id: item.id,
        contentId: item.contentId,
        sectionId: item.sectionId,
        order: item.order,
        accessOn: item.accessOn,
        accessTill: item.accessTill,
        accessOnDate: item.accessOnDate,
        accessTillDate: item.accessTillDate,
        canSubmitAssignment: item.canSubmitAssignment,
        content: item.content,
        progress: {
          status: progressStatus,
          timeSpent: item.progress?.timeSpent || 0,
          progress: item.progress?.progress || 0,
          githubLink: item.progress?.githubLink || null,
          deployedLink: item.progress?.deployedLink || null,
          assignmentStatus: item.progress?.assignmentStatus || null,
          teacherRemark: item.progress?.teacherRemark || null,
          videoFeedback: item.progress?.videoFeedback || null,
        }
      };

      const sId = item.sectionId ? Number(item.sectionId) : null;
      if (sId !== null && sectionsMap.has(sId)) {
        sectionsMap.get(sId)!.push(itemMapped);
      } else {
        unassignedContents.push(itemMapped);
      }
    }

    const sectionsWithContents = sections.map(section => ({
      ...section,
      contents: sectionsMap.get(section.id) || [],
    }));

    return {
      batch,
      enrollment: {
        id: enrollmentDetails.id,
        status: enrollmentDetails.status,
        progress: enrollmentDetails.progress,
        timeSpentSeconds: enrollmentDetails.timeSpentSeconds,
        paymentStatus: enrollmentDetails.paymentStatus,
        startedAt: enrollmentDetails.startedAt || enrollmentDetails.paidAt || enrollmentDetails.createdAt,
        accessTill: enrollmentDetails.accessTill || endDate,
        daysPassed,
        isAccessActive,
        amountPayable: enrollmentDetails.amountPayable || 0,
        amountPaid: enrollmentDetails.amountPaid || 0,
        amountRemaining: Math.max(0, (enrollmentDetails.amountPayable || 0) - (enrollmentDetails.amountPaid || 0)),
      },
      sections: sectionsWithContents,
      ...(unassignedContents.length > 0 ? { unassignedContents } : {}),
    };
  }
}
