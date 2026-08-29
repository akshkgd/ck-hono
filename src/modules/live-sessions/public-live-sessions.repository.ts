import { db } from '../../db/index.js';
import { batchLiveSessions, users, batchEnrollments, courseProgress } from '../../db/schema.js';
import { eq, and, sql } from 'drizzle-orm';

export class PublicLiveSessionsRepository {
  public async findPublicDetailsById(id: string) {
    const results = await db
      .select({
        topic: batchLiveSessions.topic,
        desc: batchLiveSessions.desc,
        time: batchLiveSessions.time,
        screenHlsVideo: batchLiveSessions.screenHlsVideo,
        faceHlsVideo: batchLiveSessions.faceHlsVideo,
        dummyCount: batchLiveSessions.dummyCount,
      })
      .from(batchLiveSessions)
      .where(eq(batchLiveSessions.id, id))
      .limit(1);

    return results[0] || null;
  }

  public async findEnrollmentByUserIdAndLiveSession(userId: string, liveSessionId: string) {
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
        eq(users.id, userId)
      ))
      .limit(1);
    return results[0] || null;
  }

  public async accumulateLiveSessionProgress(
    userId: string,
    enrollmentId: string,
    batchLiveSessionId: string,
    status: 'joined' | 'left',
    durationSeconds: number = 0
  ) {
    const isLeft = status === 'left';
    const targetStatus = isLeft ? 'completed' : 'learning';

    const results = await db
      .insert(courseProgress)
      .values({
        userId,
        enrollmentId,
        batchLiveSessionId,
        status: targetStatus,
        liveSessionTimeSpent: isLeft ? durationSeconds : 0,
        progress: isLeft ? 100 : 0,
      })
      .onConflictDoUpdate({
        target: [courseProgress.enrollmentId, courseProgress.batchLiveSessionId],
        set: isLeft
          ? {
              status: 'completed',
              progress: 100,
              liveSessionTimeSpent: sql`COALESCE(${courseProgress.liveSessionTimeSpent}, 0) + ${durationSeconds}`,
              updatedAt: new Date(),
            }
          : {
              status: 'learning',
              updatedAt: new Date(),
            },
      })
      .returning();

    return results[0];
  }
}
