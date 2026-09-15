import { Hono } from 'hono';
import { HealthController } from './health.controller.js';

const healthRouter = new Hono();
const controller = new HealthController();

healthRouter.get('/', controller.getOverallHealth);
healthRouter.get('/server', controller.getServerHealth);
healthRouter.get('/db', controller.getDbHealth);
healthRouter.get('/bunny', controller.getBunnyHealth);

export default healthRouter;
