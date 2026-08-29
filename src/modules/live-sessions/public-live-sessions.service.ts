import { PublicLiveSessionsRepository } from './public-live-sessions.repository.js';
import { PublicRecordAttendanceInput } from './public-live-sessions.validation.js';

export class PublicLiveSessionsService {
  private repository = new PublicLiveSessionsRepository();

  public async getPublicLiveSessionDetails(id: string) {
    const session = await this.repository.findPublicDetailsById(id);
    if (!session) {
      throw new Error('Live session not found');
    }

    return {
      topic: session.topic,
      desc: session.desc,
      time: session.time,
      screenHLS: session.screenHlsVideo,
      FaceHLS: session.faceHlsVideo,
      screenHlsVideo: session.screenHlsVideo,
      faceHlsVideo: session.faceHlsVideo,
      dummyCount: session.dummyCount,
    };
  }

  public async recordAttendance(data: PublicRecordAttendanceInput) {
    const record = await this.repository.findEnrollmentByUserIdAndLiveSession(data.userId, data.liveSessionId);
    if (!record) {
      throw new Error('Enrollment not found for this student and live session');
    }

    return await this.repository.accumulateLiveSessionProgress(
      record.user.id,
      record.enrollment.id,
      data.liveSessionId,
      data.status,
      data.durationSeconds || 0
    );
  }
}
