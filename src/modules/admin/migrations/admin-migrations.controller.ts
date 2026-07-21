import type { Context } from 'hono';
import { adminMigrationsService } from './admin-migrations.service.js';

export class AdminMigrationsController {
  /**
   * POST /v1/migration/users or /v1/admin/migrations/users - Queue User Migration Chunk
   */
  public queueUserMigration = async (c: Context) => {
    try {
      const user = c.get('user');
      const body = await c.req.json();

      const result = await adminMigrationsService.queueUserMigration(body, user?.id || 'admin');

      return c.json({
        success: true,
        status: 'success',
        processed: result.totalRecords,
        message: `Users chunk ${body.batch_index || 1} processed successfully.`,
        data: result,
      }, 200);
    } catch (err: any) {
      return c.json({
        success: false,
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

  /**
   * POST /v1/admin/migrations/clear-logs - Purge Old Migration Audit Logs
   */
  public clearMigrationLogs = async (c: Context) => {
    try {
      const result = await adminMigrationsService.clearMigrationLogs();
      return c.json(result, 200);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Failed to clear migration audit logs',
      }, 400);
    }
  };
}

export const adminMigrationsController = new AdminMigrationsController();
