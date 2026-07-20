import { Hono } from 'hono';
import { AppEnv } from '../../../app.js';
import { AdminQueuesController } from './queues.controller.js';
import { authMiddleware } from '../../../middleware/auth.middleware.js';
import { adminMiddleware } from '../../../middleware/admin.middleware.js';

const queuesRouter = new Hono<AppEnv>();

// Secure admin queue routes
queuesRouter.use('*', authMiddleware(), adminMiddleware());

queuesRouter.post('/email', AdminQueuesController.enqueueEmail);
queuesRouter.post('/crawler', AdminQueuesController.enqueueCrawler);
queuesRouter.post('/migration', AdminQueuesController.enqueueMigration);
queuesRouter.get('/metrics', AdminQueuesController.getMetrics);
queuesRouter.get('/logs', AdminQueuesController.getLogs);

export default queuesRouter;

