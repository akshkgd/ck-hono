import type { Context } from 'hono';
import { AdminPaymentsService } from './admin-payments.service.js';
import {
  createPaymentSchema,
  updatePaymentSchema,
  paymentSearchQuerySchema,
  transactionSearchQuerySchema
} from '../../payments/payment.validation.js';

export class AdminPaymentsController {
  private adminPaymentsService: AdminPaymentsService;

  constructor() {
    this.adminPaymentsService = new AdminPaymentsService();
  }

  public search = async (c: Context) => {
    try {
      const rawQuery = c.req.query();
      const query = paymentSearchQuerySchema.parse(rawQuery);

      const result = await this.adminPaymentsService.searchPayments(query);
      return c.json({
        status: 'success',
        data: result,
      }, 200);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Failed to search payments',
      }, 400);
    }
  };

  public get = async (c: Context) => {
    try {
      const id = parseInt(c.req.param('id')!, 10);
      if (isNaN(id)) {
        throw new Error('Invalid payment ID');
      }

      const payment = await this.adminPaymentsService.getPayment(id);
      return c.json({
        status: 'success',
        data: payment,
      }, 200);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Failed to get payment',
      }, 400);
    }
  };

  public create = async (c: Context) => {
    try {
      const rawBody = await c.req.json();
      const body = createPaymentSchema.parse(rawBody);

      const payment = await this.adminPaymentsService.createPayment(body);
      return c.json({
        status: 'success',
        message: 'Payment recorded successfully',
        data: payment,
      }, 201);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Failed to record payment',
      }, 400);
    }
  };

  public edit = async (c: Context) => {
    try {
      const id = parseInt(c.req.param('id')!, 10);
      if (isNaN(id)) {
        throw new Error('Invalid payment ID');
      }
      const rawBody = await c.req.json();
      const body = updatePaymentSchema.parse(rawBody);

      const payment = await this.adminPaymentsService.updatePayment(id, body);
      return c.json({
        status: 'success',
        message: 'Payment updated successfully',
        data: payment,
      }, 200);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Failed to update payment',
      }, 400);
    }
  };

  public delete = async (c: Context) => {
    try {
      const id = parseInt(c.req.param('id')!, 10);
      if (isNaN(id)) {
        throw new Error('Invalid payment ID');
      }
      await this.adminPaymentsService.deletePayment(id);
      return c.json({
        status: 'success',
        message: 'Payment deleted successfully',
      }, 200);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Failed to delete payment',
      }, 400);
    }
  };

  public transactions = async (c: Context) => {
    try {
      const rawQuery = c.req.query();
      const query = transactionSearchQuerySchema.parse(rawQuery);

      const result = await this.adminPaymentsService.getTransactionHistory(query);
      return c.json({
        status: 'success',
        data: result,
      }, 200);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Failed to fetch transaction history',
      }, 400);
    }
  };
}
