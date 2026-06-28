import { Hono } from 'hono';
import { PlaygroundController } from './playground.controller.js';

const playgroundRouter = new Hono();
const controller = new PlaygroundController();

playgroundRouter.get('/', controller.serve);

export default playgroundRouter;
