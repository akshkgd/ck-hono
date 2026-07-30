import type { Context } from 'hono';
import { ReportedBugsService } from './reported-bugs.service.js';

export class AdminBugsController {
  private service: ReportedBugsService;

  constructor() {
    this.service = new ReportedBugsService();
  }

  public search = async (c: Context) => {
    try {
      const query = (c.req as any).valid('query');
      const result = await this.service.searchBugs(query);

      return c.json({
        status: 'success',
        data: result,
      }, 200);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Failed to search bugs',
      }, 400);
    }
  };

  public get = async (c: Context) => {
    try {
      const id = c.req.param('id') as string;
      const result = await this.service.getBug(id);

      return c.json({
        status: 'success',
        data: result,
      }, 200);
    } catch (err: any) {
      const status = err.message.includes('not found') ? 404 : 400;
      return c.json({
        status: 'error',
        message: err.message || 'Failed to fetch bug details',
      }, status);
    }
  };

  public update = async (c: Context) => {
    try {
      const id = c.req.param('id') as string;
      const input = (c.req as any).valid('json');
      const result = await this.service.updateBug(id, input);

      return c.json({
        status: 'success',
        data: result,
      }, 200);
    } catch (err: any) {
      const status = err.message.includes('not found') ? 404 : 400;
      return c.json({
        status: 'error',
        message: err.message || 'Failed to update bug status',
      }, status);
    }
  };

  public delete = async (c: Context) => {
    try {
      const id = c.req.param('id') as string;
      await this.service.deleteBug(id);

      return c.json({
        status: 'success',
        message: 'Bug report deleted successfully',
      }, 200);
    } catch (err: any) {
      const status = err.message.includes('not found') ? 404 : 400;
      return c.json({
        status: 'error',
        message: err.message || 'Failed to delete bug report',
      }, status);
    }
  };
}
