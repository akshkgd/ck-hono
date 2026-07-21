import { Hono } from 'hono';
import { adminMigrationsController } from './admin-migrations.controller.js';
import { zValidator } from '@hono/zod-validator';
import { bulkUserMigrationSchema } from './admin-migrations.validation.js';
import type { AppEnv } from '../../../app.js';

const adminMigrationsRouter = new Hono<AppEnv>();

// Queue Bulk User Migration Job (POST /migration/users or /v1/migration/users or /v1/admin/migrations/users)
adminMigrationsRouter.post(
  '/users',
  zValidator('json', bulkUserMigrationSchema),
  adminMigrationsController.queueUserMigration
);

// Check Live Migration Job Status (GET /migration/status/:jobId)
adminMigrationsRouter.get('/status/:jobId', adminMigrationsController.getMigrationStatus);

export default adminMigrationsRouter;
