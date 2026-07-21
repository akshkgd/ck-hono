import type { Context } from 'hono';
import { AdminEnrollmentsService } from './admin-enrollments.service.js';
import {
  createEnrollmentSchema,
  updateEnrollmentSchema,
  enrollmentSearchQuerySchema
} from '../../enrollments/enrollment.validation.js';

export class AdminEnrollmentsController {
  private adminEnrollmentsService: AdminEnrollmentsService;

  constructor() {
    this.adminEnrollmentsService = new AdminEnrollmentsService();
  }

  public search = async (c: Context) => {
    try {
      const rawQuery = c.req.query();
      const query = enrollmentSearchQuerySchema.parse(rawQuery);
      
      const result = await this.adminEnrollmentsService.searchEnrollments(query);
      return c.json({
        status: 'success',
        data: result,
      }, 200);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Failed to search enrollments',
      }, 400);
    }
  };

  public get = async (c: Context) => {
    try {
      const id = c.req.param('id') || '';
      if (!id) {
        throw new Error('Invalid enrollment ID');
      }

      const enrollment = await this.adminEnrollmentsService.getEnrollment(id);
      return c.json({
        status: 'success',
        data: enrollment,
      }, 200);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Failed to get enrollment',
      }, 400);
    }
  };

  public create = async (c: Context) => {
    try {
      const rawBody = await c.req.json();
      const body = createEnrollmentSchema.parse(rawBody);

      const enrollment = await this.adminEnrollmentsService.createEnrollment(body);
      return c.json({
        status: 'success',
        message: 'Enrollment created successfully',
        data: enrollment,
      }, 201);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Failed to create enrollment',
      }, 400);
    }
  };

  public edit = async (c: Context) => {
    try {
      const id = c.req.param('id') || '';
      if (!id) {
        throw new Error('Invalid enrollment ID');
      }
      const rawBody = await c.req.json();
      const body = updateEnrollmentSchema.parse(rawBody);

      const enrollment = await this.adminEnrollmentsService.updateEnrollment(id, body);
      return c.json({
        status: 'success',
        message: 'Enrollment updated successfully',
        data: enrollment,
      }, 200);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Failed to update enrollment',
      }, 400);
    }
  };

  public delete = async (c: Context) => {
    try {
      const id = c.req.param('id') || '';
      if (!id) {
        throw new Error('Invalid enrollment ID');
      }
      await this.adminEnrollmentsService.deleteEnrollment(id);
      return c.json({
        status: 'success',
        message: 'Enrollment deleted successfully',
      }, 200);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Failed to delete enrollment',
      }, 400);
    }
  };
}
