import { AdminCourseProgressRepository } from './admin-course-progress.repository.js';
import type { ProgressQueryInput } from './admin-course-progress.validation.js';

export class AdminCourseProgressService {
  private repository: AdminCourseProgressRepository;

  constructor() {
    this.repository = new AdminCourseProgressRepository();
  }

  public async getProgressReport(input: ProgressQueryInput) {
    const { start, end } = this.getDateRange(
      input.timeRange,
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

  public async getUserBatchProgress(userId: string, batchId: number) {
    const enrollment = await this.repository.getUserEnrollmentDetails(batchId, userId);
    if (!enrollment) {
      throw new Error('Enrollment not found for this user in this batch');
    }

    const { courseStartDate, batch, ...enrollmentDetails } = enrollment;
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
      this.repository.getBatchSections(batchId),
      this.repository.getBatchContentWithProgress(batchId, userId, enrollment.id),
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
