import { db } from '../../../db/index.js';
import { learnerWatchlist, users, batches, batchEnrollments, courseProgress, batchContent, contentLibrary } from '../../../db/schema.js';
import { eq, and, or, ilike, sql, desc } from 'drizzle-orm';

export class AdminWatchlistRepository {
  public async addToWatchlist(data: {
    userId: string;
    enrollmentId: string;
    batchId: string;
    reason?: string;
    addedBy?: string;
  }) {
    const [result] = await db
      .insert(learnerWatchlist)
      .values({
        userId: data.userId,
        enrollmentId: data.enrollmentId,
        batchId: data.batchId,
        reason: data.reason || null,
        addedBy: data.addedBy || null,
      })
      .onConflictDoUpdate({
        target: [learnerWatchlist.userId, learnerWatchlist.batchId],
        set: {
          reason: data.reason || null,
          addedBy: data.addedBy || null,
          updatedAt: new Date(),
        },
      })
      .returning();
    return result;
  }

  public async removeFromWatchlist(id: string) {
    const [deleted] = await db
      .delete(learnerWatchlist)
      .where(eq(learnerWatchlist.id, id))
      .returning();
    return deleted || null;
  }

  public async findById(id: string) {
    const [item] = await db
      .select()
      .from(learnerWatchlist)
      .where(eq(learnerWatchlist.id, id))
      .limit(1);
    return item || null;
  }

  public async findByUserAndBatch(userId: string, batchId: string) {
    const [item] = await db
      .select()
      .from(learnerWatchlist)
      .where(and(eq(learnerWatchlist.userId, userId), eq(learnerWatchlist.batchId, batchId)))
      .limit(1);
    return item || null;
  }

  public async updateReason(id: string, reason: string | null) {
    const [updated] = await db
      .update(learnerWatchlist)
      .set({ reason, updatedAt: new Date() })
      .where(eq(learnerWatchlist.id, id))
      .returning();
    return updated || null;
  }

  public async findWatchlistedLearners(params: {
    batchId?: string;
    search?: string;
    page: number;
    limit: number;
  }) {
    const { batchId, search, page, limit } = params;
    const offset = (page - 1) * limit;
    const searchFilter = search ? `%${search.toLowerCase().trim()}%` : null;

    const baseWhere = and(
      batchId ? eq(learnerWatchlist.batchId, batchId) : undefined,
      searchFilter
        ? or(
            ilike(users.name, searchFilter),
            ilike(users.email, searchFilter)
          )
        : undefined
    );

    // Total watchlisted items count
    const [countResult] = await db
      .select({ count: sql<number>`count(distinct ${learnerWatchlist.id})::int` })
      .from(learnerWatchlist)
      .innerJoin(users, eq(users.id, learnerWatchlist.userId))
      .where(baseWhere);

    const totalItems = countResult?.count || 0;
    const totalPages = Math.ceil(totalItems / limit);

    if (totalItems === 0) {
      return { items: [], pagination: { page, limit, totalItems: 0, totalPages: 0 } };
    }

    // Query watchlist items with aggregated metrics in 1 single pass
    const rows = await db
      .select({
        watchlistId: learnerWatchlist.id,
        userId: users.id,
        name: users.name,
        email: users.email,
        avatarUrl: users.avatarUrl,
        batchId: batches.id,
        batchName: batches.name,
        enrollmentId: batchEnrollments.id,
        startedAt: batchEnrollments.startedAt,
        subscriptionActiveOn: batchEnrollments.subscriptionActiveOn,
        createdAt: batchEnrollments.createdAt,
        progressPercent: batchEnrollments.progress,
        timeSpentSeconds: batchEnrollments.timeSpentSeconds,
        userLastActiveAt: users.lastActiveAt,
        latestProgressUpdatedAt: sql<Date | null>`max(${courseProgress.updatedAt})`,
        reason: learnerWatchlist.reason,
        addedAt: learnerWatchlist.createdAt,
        lecturesWatched: sql<number>`count(case when ${courseProgress.status} = 'completed' and ${contentLibrary.type} in ('video', 'coding lab', 'article') then 1 end)::int`,
        assignmentsSubmitted: sql<number>`count(case when ${courseProgress.assignmentStatus} in ('submitted', 'approved', 'under review') then 1 end)::int`,
        totalLectures: sql<number>`(
          select count(*)::int from ${batchContent} bc
          join ${contentLibrary} cl on cl.id = bc.content_id
          where bc.batch_id = ${batches.id} and cl.type in ('video', 'coding lab', 'article')
        )`,
        totalAssignments: sql<number>`(
          select count(*)::int from ${batchContent} bc
          join ${contentLibrary} cl on cl.id = bc.content_id
          where bc.batch_id = ${batches.id} and (bc.can_submit_assignment = true or cl.type = 'assignment')
        )`,
      })
      .from(learnerWatchlist)
      .innerJoin(users, eq(users.id, learnerWatchlist.userId))
      .innerJoin(batches, eq(batches.id, learnerWatchlist.batchId))
      .innerJoin(batchEnrollments, eq(batchEnrollments.id, learnerWatchlist.enrollmentId))
      .leftJoin(courseProgress, eq(courseProgress.enrollmentId, learnerWatchlist.enrollmentId))
      .leftJoin(batchContent, eq(batchContent.id, courseProgress.batchContentId))
      .leftJoin(contentLibrary, eq(contentLibrary.id, batchContent.contentId))
      .where(baseWhere)
      .groupBy(
        learnerWatchlist.id,
        users.id,
        batches.id,
        batchEnrollments.id
      )
      .orderBy(desc(learnerWatchlist.createdAt))
      .limit(limit)
      .offset(offset);

    return { items: rows, pagination: { page, limit, totalItems, totalPages } };
  }
}
