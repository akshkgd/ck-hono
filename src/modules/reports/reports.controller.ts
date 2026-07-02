import type { Context } from 'hono';
import { ReportsService } from './reports.service.js';

export class ReportsController {
  private reportsService: ReportsService;

  constructor() {
    this.reportsService = new ReportsService();
  }

  public getSummary = async (c: Context) => {
    try {
      const summary = await this.reportsService.getSummary();
      return c.json({
        status: 'success',
        data: summary
      }, 200);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Failed to fetch reports summary'
      }, 400);
    }
  };
}
