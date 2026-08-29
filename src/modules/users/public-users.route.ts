import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { PublicUsersController } from './public-users.controller.js';
import { publicUserQuerySchema } from './public-users.validation.js';

const publicUsersRouter = new Hono();
const controller = new PublicUsersController();

publicUsersRouter.get(
  '/public',
  zValidator('query', publicUserQuerySchema),
  controller.getProfileByEmail
);

export default publicUsersRouter;
