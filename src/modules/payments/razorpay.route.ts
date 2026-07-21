import { Hono } from 'hono';
import { RazorpayController } from './razorpay.controller.js';
import { zValidator } from '@hono/zod-validator';
import { verifyRazorpayPaymentSchema } from './razorpay.validation.js';
import { auth } from '../../lib/auth.js';
import type { AppEnv } from '../../app.js';

const razorpayRouter = new Hono<AppEnv>();
const controller = new RazorpayController();

/**
 * Optional authentication middleware for guest/student checkout
 */
const optionalAuth = () => {
  return async (c: any, next: any) => {
    try {
      const sessionData = await auth.api.getSession({
        headers: c.req.raw.headers,
      });

      if (sessionData && sessionData.user) {
        c.set('user', sessionData.user);
      }
    } catch {
      // Unauthenticated: proceed as guest
    }
    
    await next();
  };
};

razorpayRouter.post('/create-order', optionalAuth(), controller.createOrder);
razorpayRouter.post('/verify', zValidator('json', verifyRazorpayPaymentSchema), controller.verifyPayment);
razorpayRouter.post('/webhook', controller.handleWebhook);

export default razorpayRouter;
