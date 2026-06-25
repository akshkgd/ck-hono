import { Hono } from 'hono';
import { SystemController } from './system.controller.js';

const systemRouter = new Hono();
const controller = new SystemController();

systemRouter.get('/', controller.getStatus);

export default systemRouter;
