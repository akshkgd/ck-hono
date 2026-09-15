import { db } from '../../../db/index.js';
import { batchLiveSessions, users, batchEnrollments, courseProgress, batches, batchSections } from '../../../db/schema.js';
import { eq, and, asc, desc, gte, lt, ilike, count } from 'drizzle-orm';
import { CreateLiveSessionInput, UpdateLiveSessionInput, ListAllLiveSessionsQueryInput } from './admin-live-sessions.validation.js';

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
        dummyCount: data.dummyCount ?? null,
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
    if (data.dummyCount !== undefined) updateData.dummyCount = data.dummyCount;
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

  public async findAll({
    status = 'all',
    batchId,
    search,
    page = 1,
    limit = 20,
  }: ListAllLiveSessionsQueryInput) {
    const conditions = [];

    const now = new Date();
    if (status === 'upcoming') {
      conditions.push(gte(batchLiveSessions.time, now));
    } else if (status === 'past') {
      conditions.push(lt(batchLiveSessions.time, now));
    }

    if (batchId) {
      conditions.push(eq(batchLiveSessions.batchId, batchId));
    }

    if (search && search.trim() !== '') {
      conditions.push(ilike(batchLiveSessions.topic, `%${search.trim()}%`));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const offset = (page - 1) * limit;

    const [items, totalResult] = await Promise.all([
      db
        .select({
          id: batchLiveSessions.id,
          batchId: batchLiveSessions.batchId,
          sectionId: batchLiveSessions.sectionId,
          topic: batchLiveSessions.topic,
          desc: batchLiveSessions.desc,
          time: batchLiveSessions.time,
          screenHlsVideo: batchLiveSessions.screenHlsVideo,
          faceHlsVideo: batchLiveSessions.faceHlsVideo,
          recordingHls: batchLiveSessions.recordingHls,
          order: batchLiveSessions.order,
          dummyCount: batchLiveSessions.dummyCount,
          createdAt: batchLiveSessions.createdAt,
          updatedAt: batchLiveSessions.updatedAt,
          batch: {
            id: batches.id,
            name: batches.name,
          },
          section: {
            id: batchSections.id,
            title: batchSections.title,
          },
        })
        .from(batchLiveSessions)
        .leftJoin(batches, eq(batches.id, batchLiveSessions.batchId))
        .leftJoin(batchSections, eq(batchSections.id, batchLiveSessions.sectionId))
        .where(whereClause)
        .orderBy(status === 'past' ? desc(batchLiveSessions.time) : asc(batchLiveSessions.time))
        .limit(limit)
        .offset(offset),

      db
        .select({ count: count() })
        .from(batchLiveSessions)
        .where(whereClause),
    ]);

    const total = Number(totalResult[0]?.count || 0);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
      },
    };
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
