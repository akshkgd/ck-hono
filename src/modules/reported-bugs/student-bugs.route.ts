import { Hono } from 'hono';
import { StudentBugsController } from './student-bugs.controller.js';
import { zValidator } from '@hono/zod-validator';
import { createBugSchema } from './reported-bugs.validation.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

const studentBugsRouter = new Hono();
const controller = new StudentBugsController();

studentBugsRouter.use('*', authMiddleware());

studentBugsRouter.post('/', zValidator('json', createBugSchema), controller.report);

export default studentBugsRouter;
