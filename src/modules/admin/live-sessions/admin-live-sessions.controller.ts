import type { Context } from 'hono';
import { AdminLiveSessionsService } from './admin-live-sessions.service.js';

export class AdminLiveSessionsController {
  private service = new AdminLiveSessionsService();

  public create = async (c: Context) => {
    try {
      const batchId = c.req.param('batchId') || '';
      const body = await c.req.json();
      const liveSession = await this.service.createLiveSession(batchId, body);

      return c.json({
        status: 'success',
        data: liveSession,
      }, 201);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Failed to create live session',
      }, 400);
    }
  };

  public update = async (c: Context) => {
    try {
      const id = c.req.param('id') || '';
      const body = await c.req.json();
      const liveSession = await this.service.updateLiveSession(id, body);

      return c.json({
        status: 'success',
        data: liveSession,
      }, 200);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Failed to update live session',
      }, 400);
    }
  };

  public delete = async (c: Context) => {
    try {
      const id = c.req.param('id') || '';
      const liveSession = await this.service.deleteLiveSession(id);

      return c.json({
        status: 'success',
        data: liveSession,
      }, 200);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Failed to delete live session',
      }, 400);
    }
  };

  public getDetails = async (c: Context) => {
    try {
      const id = c.req.param('id') || '';
      const liveSession = await this.service.getLiveSessionDetails(id);

      return c.json({
        status: 'success',
        data: liveSession,
      }, 200);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Failed to fetch live session details',
      }, 400);
    }
  };

  public list = async (c: Context) => {
    try {
      const batchId = c.req.param('batchId') || '';
      const { sectionId } = (c.req as any).valid('query') || {};
      const liveSessions = await this.service.getLiveSessionsForBatch(batchId, sectionId);

      return c.json({
        status: 'success',
        data: liveSessions,
      }, 200);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Failed to list live sessions',
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
      return c.json({
        status: 'error',
        message: err.message || 'Failed to record attendance',
      }, 400);
    }
  };
}
