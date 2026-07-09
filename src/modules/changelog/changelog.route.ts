import { Hono } from 'hono';
import { ChangelogController } from './changelog.controller.js';

const changelogRouter = new Hono();
const controller = new ChangelogController();

changelogRouter.get('/', controller.serve);

export default changelogRouter;
