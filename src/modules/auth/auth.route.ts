import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { AuthController } from './auth.controller.js';
import { loginSchema, registerSchema } from './auth.validation.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

const authRouter = new Hono();
const controller = new AuthController();

authRouter.post('/register', zValidator('json', registerSchema), controller.register);
authRouter.post('/login', zValidator('json', loginSchema), controller.login);
authRouter.get('/me', authMiddleware(), controller.me);
authRouter.post('/logout', authMiddleware(), controller.logout);

export default authRouter;
