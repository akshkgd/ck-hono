import { Hono } from 'hono';
import { AppEnv } from '../../../app.js';
import { AdminQueuesController } from './queues.controller.js';

const queuesRouter = new Hono<AppEnv>();

// Publicly accessible queue status & management (unprotected for temporary migration processing)
queuesRouter.post('/email', AdminQueuesController.enqueueEmail);
queuesRouter.post('/crawler', AdminQueuesController.enqueueCrawler);
queuesRouter.post('/migration', AdminQueuesController.enqueueMigration);
queuesRouter.get('/metrics', AdminQueuesController.getMetrics);
queuesRouter.get('/logs', AdminQueuesController.getLogs);

export default queuesRouter;
