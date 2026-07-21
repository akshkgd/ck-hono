import { Hono } from 'hono';
import { adminMigrationsController } from './admin-migrations.controller.js';
import { zValidator } from '@hono/zod-validator';
import { bulkUserMigrationSchema } from './admin-migrations.validation.js';
import type { AppEnv } from '../../../app.js';

const adminMigrationsRouter = new Hono<AppEnv>();

// Queue Bulk User Migration Job
adminMigrationsRouter.post(
  '/users',
  zValidator('json', bulkUserMigrationSchema),
  adminMigrationsController.queueUserMigration
);

// Check Live Migration Job Status
adminMigrationsRouter.get('/status/:jobId', adminMigrationsController.getMigrationStatus);

// Clear Migration Audit Logs
adminMigrationsRouter.post('/clear-logs', adminMigrationsController.clearMigrationLogs);

export default adminMigrationsRouter;
