import { Hono } from 'hono';
import { PublicBatchesController } from './public-batches.controller.js';

const publicBatchesRouter = new Hono();
const controller = new PublicBatchesController();

publicBatchesRouter.get('/:id/public', controller.getBatchById);
publicBatchesRouter.get('/slug/:slug/public', controller.getBatchBySlug);

export default publicBatchesRouter;
