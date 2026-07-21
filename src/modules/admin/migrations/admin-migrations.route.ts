import { Hono } from 'hono';
import { adminMigrationsController } from './admin-migrations.controller.js';
import { authMiddleware } from '../../../middleware/auth.middleware.js';
import { adminMiddleware } from '../../../middleware/admin.middleware.js';
import { zValidator } from '@hono/zod-validator';
import { bulkUserMigrationSchema } from './admin-migrations.validation.js';
import type { AppEnv } from '../../../app.js';

const adminMigrationsRouter = new Hono<AppEnv>();

// Require Admin Role for all migration endpoints
adminMigrationsRouter.use('*', authMiddleware(), adminMiddleware());

// Queue Bulk User Migration Job (POST /v1/admin/migrations/users)
adminMigrationsRouter.post('/users', zValidator('json', bulkUserMigrationSchema), adminMigrationsController.queueUserMigration);

// Check Live Migration Job Status (GET /v1/admin/migrations/status/:jobId)
adminMigrationsRouter.get('/status/:jobId', adminMigrationsController.getMigrationStatus);

export default adminMigrationsRouter;
