import { AnalyticsRepository } from './analytics.repository.js';
import { calculateDateRange } from '../../../utils/date-range.js';
import { type AnalyticsOverviewQueryInput } from './analytics.validation.js';

export class AnalyticsService {
  private analyticsRepository: AnalyticsRepository;

  constructor() {
    this.analyticsRepository = new AnalyticsRepository();
  }

  public async getOverview(input: AnalyticsOverviewQueryInput) {
    const { from, to } = calculateDateRange(input.range, input.startDate, input.endDate);
    const offset = (input.page - 1) * input.limit;

    const [
      usersSignedUp,
      coursesEnrolled,
      revenue,
      enrollments,
      totalEnrollments
    ] = await Promise.all([
      this.analyticsRepository.countSignups(from, to),
      this.analyticsRepository.countEnrollments(from, to),
      this.analyticsRepository.calculateRevenue(from, to),
      this.analyticsRepository.listEnrollments(from, to, input.limit, offset),
      this.analyticsRepository.countEnrollmentsTotal(from, to),
    ]);

    return {
      metrics: {
        usersSignedUp,
        coursesEnrolled,
        revenue,
      },
      list: enrollments,
      pagination: {
        page: input.page,
        limit: input.limit,
        total: totalEnrollments,
      },
      timeframe: {
        from: from.toISOString(),
        to: to.toISOString(),
      }
    };
  }
}
