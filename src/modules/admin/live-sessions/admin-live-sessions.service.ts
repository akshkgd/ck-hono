import { AdminLiveSessionsRepository } from './admin-live-sessions.repository.js';
import { CreateLiveSessionInput, UpdateLiveSessionInput, RecordAttendanceInput } from './admin-live-sessions.validation.js';

export class AdminLiveSessionsService {
  private repository = new AdminLiveSessionsRepository();

  public async createLiveSession(batchId: string, data: CreateLiveSessionInput) {
    return await this.repository.create(batchId, data);
  }

  public async updateLiveSession(id: string, data: UpdateLiveSessionInput) {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new Error('Live session not found');
    }
    return await this.repository.update(id, data);
  }

  public async deleteLiveSession(id: string) {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new Error('Live session not found');
    }
    return await this.repository.delete(id);
  }

  public async getLiveSessionDetails(id: string) {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new Error('Live session not found');
    }
    return existing;
  }

  public async getLiveSessionsForBatch(batchId: string, sectionId?: string | null) {
    return await this.repository.findByBatchId(batchId, sectionId);
  }

  public async recordAttendance(data: RecordAttendanceInput) {
    const record = await this.repository.findEnrollmentByEmailAndLiveSession(data.email, data.liveSessionId);
    if (!record) {
      throw new Error('Enrollment not found for this student and live session');
    }

    const progressStatus = data.status === 'joined' ? 'learning' : 'completed';
    const timeSpent = data.status === 'joined' ? 0 : (data.durationSeconds || 0);

    return await this.repository.upsertLiveSessionProgress(
      record.user.id,
      record.enrollment.id,
      data.liveSessionId,
      progressStatus,
      timeSpent
    );
  }
}
