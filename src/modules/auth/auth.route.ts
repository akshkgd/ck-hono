import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { authController } from './auth.controller.js';
import { requestMagicLinkSchema, verifyMagicLinkSchema } from './auth.validation.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

const authRouter = new Hono();

// Magic Link Auth Endpoints
authRouter.post('/magic-link/request', zValidator('json', requestMagicLinkSchema), authController.requestMagicLink);
authRouter.get('/magic-link/verify', authController.verifyMagicLink);
authRouter.post('/magic-link/verify', zValidator('json', verifyMagicLinkSchema), authController.verifyMagicLink);

// Session Endpoints
authRouter.post('/logout', authController.logout);
authRouter.get('/me', authMiddleware(), authController.getMe);

export default authRouter;
