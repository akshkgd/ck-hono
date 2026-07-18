import { Hono } from 'hono';
import { RazorpayController } from './razorpay.controller.js';
import { zValidator } from '@hono/zod-validator';
import { createRazorpayOrderSchema, verifyRazorpayPaymentSchema } from './razorpay.validation.js';
import { verify } from 'hono/jwt';
import { getCookie } from 'hono/cookie';
import { UserRepository } from '../users/user.repository.js';
import type { AppEnv } from '../../app.js';

const razorpayRouter = new Hono<AppEnv>();
const controller = new RazorpayController();
const userRepository = new UserRepository();

/**
   * Middleware to optionally authenticate a user
   */
const optionalAuth = () => {
  return async (c: any, next: any) => {
    let token = getCookie(c, 'token') || '';
    if (!token) {
      const authHeader = c.req.header('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      } else {
        token = c.req.query('token') || '';
      }
    }

    if (!token) {
      return await next();
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return await next();
    }

    try {
      const decoded = await verify(token, jwtSecret, 'HS256');
      if (decoded && decoded.id) {
        const user = await userRepository.findById(decoded.id as string);
        if (user) {
          const { password, ...userWithoutPassword } = user;
          c.set('user', userWithoutPassword);
        }
      }
    } catch (err) {
      // Token expired or invalid: ignore and proceed as guest
    }
    
    await next();
  };
};

razorpayRouter.post('/create-order', optionalAuth(), controller.createOrder);
razorpayRouter.post('/verify', zValidator('json', verifyRazorpayPaymentSchema), controller.verifyPayment);
razorpayRouter.post('/webhook', controller.handleWebhook);

export default razorpayRouter;
