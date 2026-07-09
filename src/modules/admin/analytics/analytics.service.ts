import { AnalyticsRepository } from './analytics.repository.js';
import { calculateDateRange, calculatePreviousDateRange, getGroupInterval, generateTrendBuckets } from '../../../utils/date-range.js';
import { type AnalyticsOverviewQueryInput } from './analytics.validation.js';

export class AnalyticsService {
  private analyticsRepository: AnalyticsRepository;

  constructor() {
    this.analyticsRepository = new AnalyticsRepository();
  }

  public async getOverview(input: AnalyticsOverviewQueryInput) {
    const { from, to } = calculateDateRange(input.range, input.startDate, input.endDate);
    const prevRange = calculatePreviousDateRange(input.range || 'last7Days', { from, to });
    const interval = getGroupInterval(input.range || 'last7Days', from, to);
    
    const offset = (input.page - 1) * input.limit;

    const [
      currentSignups,
      prevSignups,
      currentEnrollments,
      prevEnrollments,
      currentRevenue,
      prevRevenue,
      signupTrendRaw,
      enrollmentTrendRaw,
      revenueTrendRaw,
      enrollments,
      totalEnrollments
    ] = await Promise.all([
      this.analyticsRepository.countSignups(from, to),
      this.analyticsRepository.countSignups(prevRange.from, prevRange.to),
      this.analyticsRepository.countEnrollments(from, to),
      this.analyticsRepository.countEnrollments(prevRange.from, prevRange.to),
      this.analyticsRepository.calculateRevenue(from, to),
      this.analyticsRepository.calculateRevenue(prevRange.from, prevRange.to),
      this.analyticsRepository.getSignupTrend(from, to, interval),
      this.analyticsRepository.getEnrollmentTrend(from, to, interval),
      this.analyticsRepository.getRevenueTrend(from, to, interval),
      this.analyticsRepository.listEnrollments(from, to, input.limit, offset),
      this.analyticsRepository.countEnrollmentsTotal(from, to),
    ]);

    // Populate signups trend
    const signupsTrendObj = generateTrendBuckets(from, to, interval);
    for (const row of signupTrendRaw) {
      const idx = signupsTrendObj.keyMap.get(row.bucket);
      if (idx !== undefined) {
        signupsTrendObj.buckets[idx].value = Number(row.count || 0);
      }
    }

    // Populate enrollments trend
    const enrollmentsTrendObj = generateTrendBuckets(from, to, interval);
    for (const row of enrollmentTrendRaw) {
      const idx = enrollmentsTrendObj.keyMap.get(row.bucket);
      if (idx !== undefined) {
        enrollmentsTrendObj.buckets[idx].value = Number(row.count || 0);
      }
    }

    // Populate revenue trend
    const revenueTrendObj = generateTrendBuckets(from, to, interval);
    for (const row of revenueTrendRaw) {
      const idx = revenueTrendObj.keyMap.get(row.bucket);
      if (idx !== undefined) {
        revenueTrendObj.buckets[idx].value = Number(row.sum || 0);
      }
    }

    const signupChange = calculatePercentageChange(currentSignups, prevSignups);
    const enrollmentChange = calculatePercentageChange(currentEnrollments, prevEnrollments);
    const revenueChange = calculatePercentageChange(currentRevenue, prevRevenue);

    return {
      metrics: {
        usersSignedUp: {
          current: currentSignups,
          previous: prevSignups,
          percentageChange: signupChange,
          direction: getDirection(signupChange),
          trend: signupsTrendObj.buckets
        },
        coursesEnrolled: {
          current: currentEnrollments,
          previous: prevEnrollments,
          percentageChange: enrollmentChange,
          direction: getDirection(enrollmentChange),
          trend: enrollmentsTrendObj.buckets
        },
        revenue: {
          current: currentRevenue,
          previous: prevRevenue,
          percentageChange: revenueChange,
          direction: getDirection(revenueChange),
          trend: revenueTrendObj.buckets
        },
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
      },
      comparisonTimeframe: {
        from: prevRange.from.toISOString(),
        to: prevRange.to.toISOString(),
      }
    };
  }

  public async getDbStats() {
    return this.analyticsRepository.getTableStats();
  }
}

function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) {
    if (current === 0) return 0;
    return 100;
  }
  const change = ((current - previous) / previous) * 100;
  return parseFloat(change.toFixed(2));
}

function getDirection(change: number): 'up' | 'down' | 'flat' {
  if (change > 0) return 'up';
  if (change < 0) return 'down';
  return 'flat';
}
