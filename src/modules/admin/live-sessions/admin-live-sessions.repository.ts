import { db } from '../../../db/index.js';
import { batchLiveSessions, users, batchEnrollments, courseProgress } from '../../../db/schema.js';
import { eq, and, asc } from 'drizzle-orm';
import { CreateLiveSessionInput, UpdateLiveSessionInput } from './admin-live-sessions.validation.js';

export class AdminLiveSessionsRepository {
  public async create(batchId: string, data: CreateLiveSessionInput) {
    const results = await db
      .insert(batchLiveSessions)
      .values({
        batchId,
        sectionId: data.sectionId || null,
        topic: data.topic,
        desc: data.desc || null,
        time: new Date(data.time),
        screenHlsVideo: data.screenHlsVideo || null,
        faceHlsVideo: data.faceHlsVideo || null,
        recordingHls: data.recordingHls || null,
        order: data.order ?? 0,
      })
      .returning();
    return results[0];
  }

  public async update(id: string, data: UpdateLiveSessionInput) {
    const updateData: any = {};
    if (data.topic !== undefined) updateData.topic = data.topic;
    if (data.desc !== undefined) updateData.desc = data.desc;
    if (data.time !== undefined) updateData.time = new Date(data.time);
    if (data.sectionId !== undefined) updateData.sectionId = data.sectionId;
    if (data.screenHlsVideo !== undefined) updateData.screenHlsVideo = data.screenHlsVideo;
    if (data.faceHlsVideo !== undefined) updateData.faceHlsVideo = data.faceHlsVideo;
    if (data.recordingHls !== undefined) updateData.recordingHls = data.recordingHls;
    if (data.order !== undefined) updateData.order = data.order;
    updateData.updatedAt = new Date();

    const results = await db
      .update(batchLiveSessions)
      .set(updateData)
      .where(eq(batchLiveSessions.id, id))
      .returning();
    return results[0];
  }

  public async delete(id: string) {
    const results = await db
      .delete(batchLiveSessions)
      .where(eq(batchLiveSessions.id, id))
      .returning();
    return results[0];
  }

  public async findById(id: string) {
    const results = await db
      .select()
      .from(batchLiveSessions)
      .where(eq(batchLiveSessions.id, id))
      .limit(1);
    return results[0];
  }

  public async findByBatchId(batchId: string, sectionId?: string | null) {
    let query = db
      .select()
      .from(batchLiveSessions)
      .where(
        sectionId
          ? and(
              eq(batchLiveSessions.batchId, batchId),
              eq(batchLiveSessions.sectionId, sectionId)
            )
          : eq(batchLiveSessions.batchId, batchId)
      )
      .orderBy(asc(batchLiveSessions.order));

    return await query;
  }

  public async findEnrollmentByEmailAndLiveSession(email: string, liveSessionId: string) {
    const results = await db
      .select({
        user: users,
        enrollment: batchEnrollments,
        liveSession: batchLiveSessions,
      })
      .from(batchLiveSessions)
      .innerJoin(batchEnrollments, eq(batchEnrollments.batchId, batchLiveSessions.batchId))
      .innerJoin(users, eq(users.id, batchEnrollments.userId))
      .where(and(
        eq(batchLiveSessions.id, liveSessionId),
        eq(users.email, email)
      ))
      .limit(1);
    return results[0];
  }

  public async upsertLiveSessionProgress(
    userId: string,
    enrollmentId: string,
    batchLiveSessionId: string,
    status: 'learning' | 'completed',
    liveSessionTimeSpent: number
  ) {
    const results = await db
      .insert(courseProgress)
      .values({
        userId,
        enrollmentId,
        batchLiveSessionId,
        status,
        liveSessionTimeSpent,
        progress: status === 'completed' ? 100 : 0,
      })
      .onConflictDoUpdate({
        target: [courseProgress.enrollmentId, courseProgress.batchLiveSessionId],
        set: {
          status,
          liveSessionTimeSpent,
          progress: status === 'completed' ? 100 : 0,
          updatedAt: new Date(),
        },
      })
      .returning();
    return results[0];
  }
}
