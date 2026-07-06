import type { Context } from 'hono';
import { AnalyticsService } from './analytics.service.js';
import { analyticsOverviewQuerySchema } from './analytics.validation.js';

export class AnalyticsController {
  private analyticsService: AnalyticsService;

  constructor() {
    this.analyticsService = new AnalyticsService();
  }

  public getOverview = async (c: Context) => {
    try {
      const rawQuery = c.req.query();
      const query = analyticsOverviewQuerySchema.parse(rawQuery);

      const overview = await this.analyticsService.getOverview(query);
      return c.json({
        status: 'success',
        data: overview
      }, 200);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Failed to fetch analytics overview'
      }, 400);
    }
  };

  public getDbStats = async (c: Context) => {
    try {
      const stats = await this.analyticsService.getDbStats();
      return c.json({
        status: 'success',
        data: stats
      }, 200);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Failed to fetch database stats'
      }, 400);
    }
  };
}
