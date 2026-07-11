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
      this.repository.getProgressList(start, end, input.batchId, input.email || undefined, limit, offset),
      this.repository.countProgressTotal(start, end, input.batchId, input.email || undefined),
      this.repository.getProgressAnalytics(start, end, input.batchId, input.email || undefined),
      this.repository.getDailyProgressAnalytics(start, end, input.batchId, input.email || undefined),
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
}
