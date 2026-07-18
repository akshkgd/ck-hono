import type { Context } from 'hono';
import { RazorpayService } from './razorpay.service.js';
import { createRazorpayOrderSchema } from './razorpay.validation.js';

export class RazorpayController {
  private razorpayService: RazorpayService;

  constructor() {
    this.razorpayService = new RazorpayService();
  }

  public createOrder = async (c: Context) => {
    try {
      const user = c.get('user') || null;
      
      const query = c.req.query();
      let body: any = {};
      const contentType = c.req.header('content-type') || '';
      if (contentType.includes('application/json')) {
        try {
          body = await c.req.json();
        } catch (_) {
          // ignore parsing error
        }
      }

      const rawData = { ...query, ...body };

      // Coerce numeric fields if they come from query parameters
      if (rawData.batchId !== undefined && typeof rawData.batchId === 'string') {
        rawData.batchId = parseInt(rawData.batchId, 10);
      }
      if (rawData.enrollmentId !== undefined && typeof rawData.enrollmentId === 'string') {
        rawData.enrollmentId = parseInt(rawData.enrollmentId, 10);
      }

      const input = createRazorpayOrderSchema.parse(rawData);
      const data = await this.razorpayService.createOrder(input, user);

      return c.json({
        status: 'success',
        data,
      }, 201);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Failed to create payment order',
      }, 400);
    }
  };

  public verifyPayment = async (c: Context) => {
    try {
      const input = (c.req as any).valid('json');

      const result = await this.razorpayService.verifyPayment(input);

      return c.json(result, 200);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Failed to verify payment',
      }, 400);
    }
  };

  public handleWebhook = async (c: Context) => {
    try {
      const signature = c.req.header('X-Razorpay-Signature') || '';
      const rawBody = await c.req.text();

      const result = await this.razorpayService.handleWebhook(rawBody, signature);

      return c.json(result, 200);
    } catch (err: any) {
      console.error('[Razorpay Webhook Error]', err);
      return c.json({
        status: 'error',
        message: err.message || 'Webhook processing failed',
      }, 400);
    }
  };
}
