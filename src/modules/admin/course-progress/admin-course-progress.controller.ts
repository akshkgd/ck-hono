import type { Context } from 'hono';
import { AdminCourseProgressService } from './admin-course-progress.service.js';
import { bulkUpdateProgressSchema } from './admin-course-progress.validation.js';

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

  public getEnrollmentBatchProgress = async (c: Context) => {
    try {
      const { enrollmentId } = (c.req as any).valid('param');
      const progressDetails = await this.progressService.getEnrollmentBatchProgress(enrollmentId);

      return c.json({
        status: 'success',
        data: progressDetails,
      }, 200);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Failed to fetch enrollment batch progress',
      }, 400);
    }
  };

  public resetSubmittedAssignments = async (c: Context) => {
    try {
      const { batchId } = (c.req as any).valid('json');
      const count = await this.progressService.resetSubmittedAssignmentsToPending(batchId || undefined);

      return c.json({
        status: 'success',
        message: `Successfully changed status of ${count} assignments from submitted to pending`,
        data: { count },
      }, 200);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Failed to reset assignment statuses',
      }, 400);
    }
  };

  public bulkUpdateProgress = async (c: Context) => {
    try {
      const rawBody = await c.req.json();
      const body = bulkUpdateProgressSchema.parse(rawBody);

      const result = await this.progressService.bulkUpdateProgress(body);
      return c.json({
        status: 'success',
        message: `Successfully updated progress for ${result.updatedCount} chapters`,
        data: result,
      }, 200);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Failed to update course progress',
      }, 400);
    }
  };
}
