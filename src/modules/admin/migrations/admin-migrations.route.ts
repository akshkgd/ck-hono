import { Hono } from 'hono';
import { adminMigrationsController } from './admin-migrations.controller.js';
import { zValidator } from '@hono/zod-validator';
import { bulkUserMigrationSchema, bulkBatchMigrationSchema, bulkEnrollmentMigrationSchema, bulkPaymentMigrationSchema } from './admin-migrations.validation.js';
import type { AppEnv } from '../../../app.js';

const adminMigrationsRouter = new Hono<AppEnv>();

// Queue Bulk User Migration Job
adminMigrationsRouter.post(
  '/users',
  zValidator('json', bulkUserMigrationSchema),
  adminMigrationsController.queueUserMigration
);

// Queue Bulk Batch Migration Job
adminMigrationsRouter.post(
  '/batches',
  zValidator('json', bulkBatchMigrationSchema),
  adminMigrationsController.queueBatchMigration
);

// Queue Bulk Enrollment Migration Job
adminMigrationsRouter.post(
  '/enrollments',
  zValidator('json', bulkEnrollmentMigrationSchema),
  adminMigrationsController.queueEnrollmentMigration
);

// Queue Bulk Payment Migration Job
adminMigrationsRouter.post(
  '/payments',
  zValidator('json', bulkPaymentMigrationSchema),
  adminMigrationsController.queuePaymentMigration
);

// Check Live Migration Job Status
adminMigrationsRouter.get('/status/:jobId', adminMigrationsController.getMigrationStatus);

// Clear Migration Audit Logs
adminMigrationsRouter.post('/clear-logs', adminMigrationsController.clearMigrationLogs);

export default adminMigrationsRouter;
