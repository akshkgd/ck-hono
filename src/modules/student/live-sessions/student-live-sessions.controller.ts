import type { Context } from 'hono';
import { StudentRepository } from '../student.repository.js';
import { AdminLiveSessionsRepository } from '../../admin/live-sessions/admin-live-sessions.repository.js';

export class StudentLiveSessionsController {
  private studentRepository = new StudentRepository();
  private liveSessionsRepository = new AdminLiveSessionsRepository();

  public list = async (c: Context) => {
    try {
      const user = c.get('user');
      if (!user || !user.id) {
        return c.json({
          status: 'error',
          message: 'Unauthorized: Missing user context',
        }, 401);
      }

      const batchId = c.req.param('batchId') || '';

      // Verify enrollment
      const enrollment = await this.studentRepository.findEnrollment(user.id, batchId);
      if (!enrollment) {
        return c.json({
          status: 'error',
          message: 'Access denied: Enrollment not found for this course',
        }, 403);
      }
      if (enrollment.paymentStatus !== 'captured') {
        return c.json({
          status: 'error',
          message: 'Access denied: Course requires a captured enrollment payment',
        }, 403);
      }

      // Verify batch type is live or cohort
      const isLiveOrCohort = enrollment.batchType === 'live' || enrollment.batchType === 'cohort';

      // Fetch live sessions
      const liveSessions = isLiveOrCohort
        ? await this.liveSessionsRepository.findByBatchId(batchId)
        : [];

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
}
