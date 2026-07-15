import type { Context } from 'hono';
import { AdminCourseProgressService } from './admin-course-progress.service.js';

export class AdminCourseProgressController {
  private progressService: AdminCourseProgressService;

  constructor() {
    this.progressService = new AdminCourseProgressService();
  }

  public getProgressLog = async (c: Context) => {
    try {
      // Inputs already verified by zValidator
      const input = (c.req as any).valid('query');
      const report = await this.progressService.getProgressReport(input);

      return c.json({
        status: 'success',
        data: report,
      }, 200);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Failed to fetch course progress analytics',
      }, 400);
    }
  };

  public getUserBatchProgress = async (c: Context) => {
    try {
      const { userId, batchId } = (c.req as any).valid('param');
      const progressDetails = await this.progressService.getUserBatchProgress(userId, batchId);

      return c.json({
        status: 'success',
        data: progressDetails,
      }, 200);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Failed to fetch user batch progress',
      }, 400);
    }
  };
}
