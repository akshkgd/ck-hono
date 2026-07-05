import type { Context } from 'hono';
import { CourseProgressService } from './course-progress.service.js';
import { upsertProgressSchema } from './course-progress.validation.js';

export class CourseProgressController {
  private courseProgressService: CourseProgressService;

  constructor() {
    this.courseProgressService = new CourseProgressService();
  }

  public upsertProgress = async (c: Context) => {
    try {
      const user = c.get('user');
      const rawBody = await c.req.json();
      const body = upsertProgressSchema.parse(rawBody);

      const record = await this.courseProgressService.updateProgress(user.id, body);
      return c.json({
        status: 'success',
        message: 'Course progress updated successfully',
        data: record,
      }, 200);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Failed to update course progress',
      }, 400);
    }
  };

  public getBatchProgress = async (c: Context) => {
    try {
      const user = c.get('user');
      const batchId = parseInt(c.req.param('batchId')!, 10);
      if (isNaN(batchId)) {
        throw new Error('Invalid batch ID');
      }

      const result = await this.courseProgressService.getBatchProgress(user.id, batchId);
      return c.json({
        status: 'success',
        data: result,
      }, 200);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Failed to get batch progress',
      }, 400);
    }
  };
}
