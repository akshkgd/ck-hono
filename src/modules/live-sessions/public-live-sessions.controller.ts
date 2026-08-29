import type { Context } from 'hono';
import { PublicLiveSessionsService } from './public-live-sessions.service.js';

export class PublicLiveSessionsController {
  private service = new PublicLiveSessionsService();

  public getPublicDetails = async (c: Context) => {
    try {
      const id = c.req.param('id') || '';
      const sessionDetails = await this.service.getPublicLiveSessionDetails(id);

      return c.json({
        status: 'success',
        data: sessionDetails,
      }, 200);
    } catch (err: any) {
      if (err.message === 'Live session not found') {
        return c.json({
          status: 'error',
          message: 'Live session not found',
        }, 404);
      }

      return c.json({
        status: 'error',
        message: err.message || 'Failed to fetch live session details',
      }, 400);
    }
  };

  public recordAttendance = async (c: Context) => {
    try {
      const body = (c.req as any).valid('json');
      const progress = await this.service.recordAttendance(body);

      return c.json({
        status: 'success',
        data: progress,
      }, 200);
    } catch (err: any) {
      if (err.message === 'Enrollment not found for this student and live session') {
        return c.json({
          status: 'error',
          message: err.message,
        }, 404);
      }

      return c.json({
        status: 'error',
        message: err.message || 'Failed to record attendance',
      }, 400);
    }
  };
}
