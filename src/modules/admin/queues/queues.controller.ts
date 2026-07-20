import { Context } from 'hono';
import { AdminQueuesService } from './queues.service.js';

export class AdminQueuesController {
  static async enqueueEmail(c: Context) {
    const body = await c.req.json();
    if (!body.to || !body.subject) {
      return c.json({ status: 'error', message: 'Fields "to" and "subject" are required.' }, 400);
    }
    const result = await AdminQueuesService.enqueueEmail(body);
    return c.json({ status: 'success', data: result }, 202);
  }

  static async enqueueCrawler(c: Context) {
    const body = await c.req.json();
    if (!body.url) {
      return c.json({ status: 'error', message: 'Field "url" is required.' }, 400);
    }
    const result = await AdminQueuesService.enqueueCrawler(body);
    return c.json({ status: 'success', data: result }, 202);
  }

  static async enqueueMigration(c: Context) {
    const body = await c.req.json();
    if (!body.migrationName) {
      return c.json({ status: 'error', message: 'Field "migrationName" is required.' }, 400);
    }
    const result = await AdminQueuesService.enqueueMigration(body);
    return c.json({ status: 'success', data: result }, 202);
  }

  static async getMetrics(c: Context) {
    const metrics = await AdminQueuesService.getQueueMetrics();
    return c.json({ status: 'success', data: metrics });
  }

  static async getLogs(c: Context) {
    const queueName = c.req.query('queueName');
    const limit = parseInt(c.req.query('limit') || '50', 10);
    const logs = await AdminQueuesService.getJobLogs(limit, queueName);
    return c.json({ status: 'success', data: logs });
  }
}
