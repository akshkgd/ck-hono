import { Hono } from 'hono';
import { StudentController } from './student.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { zValidator } from '@hono/zod-validator';
import { studentProgressSchema, studentAssignmentSchema } from './student.validation.js';

const studentRouter = new Hono();
const controller = new StudentController();

// Protected endpoints for students
studentRouter.get('/courses', authMiddleware(), controller.getCourses);
studentRouter.get('/courses/:batchId', authMiddleware(), controller.getCourseDetails);
studentRouter.get('/courses/content/:batchContentId/access', authMiddleware(), controller.checkAccess);
studentRouter.post('/courses/content/progress', authMiddleware(), zValidator('json', studentProgressSchema), controller.updateProgress);
studentRouter.post('/courses/content/:batchContentId/assignment', authMiddleware(), zValidator('json', studentAssignmentSchema), controller.submitAssignment);

export default studentRouter;
