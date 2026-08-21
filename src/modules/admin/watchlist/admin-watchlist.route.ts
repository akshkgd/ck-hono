import { Hono } from 'hono';
import { AdminWatchlistController } from './admin-watchlist.controller.js';
import { authMiddleware } from '../../../middleware/auth.middleware.js';
import { adminMiddleware } from '../../../middleware/admin.middleware.js';
import type { AppEnv } from '../../../app.js';

const adminWatchlistRouter = new Hono<AppEnv>();
const controller = new AdminWatchlistController();

// All watchlist management operations require authentication and admin role
adminWatchlistRouter.use('*', authMiddleware(), adminMiddleware());

adminWatchlistRouter.get('/', controller.list);
adminWatchlistRouter.post('/', controller.add);
adminWatchlistRouter.put('/:id', controller.update);
adminWatchlistRouter.delete('/:id', controller.delete);

export default adminWatchlistRouter;
