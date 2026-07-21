import type { Context } from 'hono';
import { adminMigrationsService } from './admin-migrations.service.js';

export class AdminMigrationsController {
  /**
   * POST /v1/admin/migrations/users - Queue User Migration
   */
  public queueUserMigration = async (c: Context) => {
    try {
      const user = c.get('user');
      const body = await c.req.json();

      const result = await adminMigrationsService.queueUserMigration(body, user?.id || 'admin');

      return c.json({
        status: 'success',
        message: `Migration job queued successfully for ${result.totalRecords} user records.`,
        data: result,
      }, 202);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Failed to queue user migration job',
      }, 400);
    }
  };

  /**
   * GET /v1/admin/migrations/status/:jobId - Check Migration Live Status
   */
  public getMigrationStatus = async (c: Context) => {
    try {
      const jobId = c.req.param('jobId') || '';
      const status = await adminMigrationsService.getMigrationStatus(jobId);

      if (!status) {
        return c.json({
          status: 'error',
          message: 'Migration job not found',
        }, 404);
      }

      return c.json({
        status: 'success',
        data: status,
      }, 200);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Failed to retrieve migration status',
      }, 400);
    }
  };
}

export const adminMigrationsController = new AdminMigrationsController();
