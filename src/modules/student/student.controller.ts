import type { Context } from 'hono';
import { StudentService } from './student.service.js';

export class StudentController {
  private studentService: StudentService;

  constructor() {
    this.studentService = new StudentService();
  }

  public getCourses = async (c: Context) => {
    try {
      const user = c.get('user');
      if (!user || !user.id) {
        return c.json({
          status: 'error',
          message: 'Unauthorized: Missing user context',
        }, 401);
      }

      const courses = await this.studentService.getEnrolledCourses(user.id);
      return c.json({
        status: 'success',
        data: { courses },
      }, 200);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Failed to fetch enrolled courses',
      }, 400);
    }
  };

  public getCourseDetails = async (c: Context) => {
    try {
      const user = c.get('user');
      if (!user || !user.id) {
        return c.json({
          status: 'error',
          message: 'Unauthorized: Missing user context',
        }, 401);
      }

      const batchIdStr = c.req.param('batchId') || '';
      const batchId = parseInt(batchIdStr, 10);
      if (isNaN(batchId)) {
        return c.json({
          status: 'error',
          message: 'Bad Request: Invalid batch ID',
        }, 400);
      }

      const details = await this.studentService.getCourseDetails(user.id, batchId);
      return c.json({
        status: 'success',
        data: details,
      }, 200);
    } catch (err: any) {
      const status = err.message.includes('Unauthorized') || err.message.includes('Access denied') ? 403 : 400;
      return c.json({
        status: 'error',
        message: err.message || 'Failed to fetch course details',
      }, status);
    }
  };

  public checkAccess = async (c: Context) => {
    try {
      const user = c.get('user');
      if (!user || !user.id) {
        return c.json({
          status: 'error',
          message: 'Unauthorized: Missing user context',
        }, 401);
      }

      const batchContentIdStr = c.req.param('batchContentId') || '';
      const batchContentId = parseInt(batchContentIdStr, 10);
      if (isNaN(batchContentId)) {
        return c.json({
          status: 'error',
          message: 'Bad Request: Invalid batch content ID',
        }, 400);
      }

      const result = await this.studentService.checkContentAccess(user.id, batchContentId);
      return c.json({
        status: 'success',
        data: result,
      }, 200);
    } catch (err: any) {
      const status = err.message.includes('Access denied') ? 403 : 400;
      return c.json({
        status: 'error',
        message: err.message || 'Failed to verify content access',
      }, status);
    }
  };

  public updateProgress = async (c: Context) => {
    try {
      const user = c.get('user');
      if (!user || !user.id) {
        return c.json({
          status: 'error',
          message: 'Unauthorized: Missing user context',
        }, 401);
      }

      // Validated JSON body inputs parsed from middleware
      const input = (c.req as any).valid('json');
      const result = await this.studentService.updateStudentProgress(user.id, input);

      return c.json({
        status: 'success',
        data: result,
      }, 200);
    } catch (err: any) {
      const status = err.message.includes('Access denied') ? 403 : 400;
      return c.json({
        status: 'error',
        message: err.message || 'Failed to update course progress',
      }, status);
    }
  };

  public submitAssignment = async (c: Context) => {
    try {
      const user = c.get('user');
      if (!user || !user.id) {
        return c.json({
          status: 'error',
          message: 'Unauthorized: Missing user context',
        }, 401);
      }

      const batchContentId = parseInt(c.req.param('batchContentId') || '', 10);
      if (isNaN(batchContentId)) {
        return c.json({
          status: 'error',
          message: 'Bad Request: Invalid batch content ID',
        }, 400);
      }

      const input = (c.req as any).valid('json');
      const result = await this.studentService.submitAssignment(user.id, batchContentId, input);

      return c.json({
        status: 'success',
        data: result,
      }, 200);
    } catch (err: any) {
      const status = err.message.includes('Access denied') ? 403 : 400;
      return c.json({
        status: 'error',
        message: err.message || 'Failed to submit assignment',
      }, status);
    }
  };

  public getPayments = async (c: Context) => {
    try {
      const user = c.get('user');
      if (!user || !user.id) {
        return c.json({
          status: 'error',
          message: 'Unauthorized: Missing user context',
        }, 401);
      }

      const payments = await this.studentService.getPaymentsHistory(user.id);

      return c.json({
        status: 'success',
        data: payments,
      }, 200);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Failed to fetch payments history',
      }, 400);
    }
  };
}
