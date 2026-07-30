import type { Context } from 'hono';
import { ReportedBugsService } from './reported-bugs.service.js';

export class StudentBugsController {
  private service: ReportedBugsService;

  constructor() {
    this.service = new ReportedBugsService();
  }

  public report = async (c: Context) => {
    try {
      const user = c.get('user');
      if (!user || !user.id) {
        return c.json({
          status: 'error',
          message: 'Unauthorized: Missing user context',
        }, 401);
      }

      const input = (c.req as any).valid('json');
      const result = await this.service.reportBug(user.id, input);

      return c.json({
        status: 'success',
        data: result,
      }, 201);
    } catch (err: any) {
      return c.json({
        status: 'error',
        message: err.message || 'Failed to report bug',
      }, 400);
    }
  };
}
