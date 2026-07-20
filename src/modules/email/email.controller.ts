import { Context } from 'hono';
import { emailService } from './email.service.js';

export class EmailController {
  async sendEnrollmentEmail(c: Context) {
    const body = await c.req.json();
    const result = await emailService.sendEnrollmentEmail(body);
    return c.json({
      success: true,
      message: 'Enrollment email queued successfully',
      data: result,
    }, 202);
  }

  async sendPaymentSuccessEmail(c: Context) {
    const body = await c.req.json();
    const result = await emailService.sendPaymentSuccessEmail(body);
    return c.json({
      success: true,
      message: 'Payment success email queued successfully',
      data: result,
    }, 202);
  }

  async sendAccessGrantedEmail(c: Context) {
    const body = await c.req.json();
    const result = await emailService.sendAccessGrantedEmail(body);
    return c.json({
      success: true,
      message: 'Access granted email queued successfully',
      data: result,
    }, 202);
  }

  async sendGenericEmail(c: Context) {
    const body = await c.req.json();
    const result = await emailService.sendGenericEmail(body);
    return c.json({
      success: true,
      message: 'Generic email queued successfully',
      data: result,
    }, 202);
  }

  async getHealth(c: Context) {
    const status = await emailService.checkSmtpHealth();
    return c.json({
      success: true,
      data: status,
    });
  }

  async getAuditLogs(c: Context) {
    const limit = parseInt(c.req.query('limit') || '50', 10);
    const offset = parseInt(c.req.query('offset') || '0', 10);
    const logs = await emailService.getAuditLogs(limit, offset);
    return c.json({
      success: true,
      data: logs,
    });
  }
}

export const emailController = new EmailController();
