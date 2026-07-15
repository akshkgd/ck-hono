import type { Context } from 'hono';
import { AdminAssignmentsService } from './admin-assignments.service.js';

export class AdminAssignmentsController {
  private service: AdminAssignmentsService;

  constructor() {
    this.service = new AdminAssignmentsService();
  }

  public getAssignments = async (c: Context) => {
    try {
      const input = (c.req as any).valid('query');
      const result = await this.service.getAssignmentsReport(input);

      return c.json({
        status: 'success',
        data: result,
      }, 200);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Failed to fetch assignments report',
      }, 400);
    }
  };

  public gradeSubmission = async (c: Context) => {
    try {
      const progressId = parseInt(c.req.param('progressId') || '', 10);
      if (isNaN(progressId)) {
        return c.json({
          status: 'error',
          message: 'Bad Request: Invalid progress ID',
        }, 400);
      }

      const input = (c.req as any).valid('json');
      const updated = await this.service.gradeSubmission(progressId, input);

      return c.json({
        status: 'success',
        data: updated,
      }, 200);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Failed to grade submission',
      }, 400);
    }
  };

  public getUserAssignments = async (c: Context) => {
    try {
      const { userId, batchId } = (c.req as any).valid('param');
      const assignmentsDetails = await this.service.getUserAssignmentsReport(userId, batchId);

      return c.json({
        status: 'success',
        data: assignmentsDetails,
      }, 200);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Failed to fetch user assignments',
      }, 400);
    }
  };
}
