import { AdminWatchlistRepository } from './admin-watchlist.repository.js';
import type { AddToWatchlistInput, UpdateWatchlistInput, ListWatchlistQuery } from './admin-watchlist.validation.js';
import { db } from '../../../db/index.js';
import { batchEnrollments } from '../../../db/schema.js';
import { eq } from 'drizzle-orm';

function formatSecondsToDuration(totalSeconds: number): string {
  if (!totalSeconds || totalSeconds <= 0) return '0m';
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

export class AdminWatchlistService {
  private repository: AdminWatchlistRepository;

  constructor() {
    this.repository = new AdminWatchlistRepository();
  }

  public async addToWatchlist(input: AddToWatchlistInput, adminUserId: string) {
    const [enrollment] = await db
      .select()
      .from(batchEnrollments)
      .where(eq(batchEnrollments.id, input.enrollmentId))
      .limit(1);

    if (!enrollment) {
      throw new Error('Batch enrollment not found');
    }

    const item = await this.repository.addToWatchlist({
      userId: enrollment.userId,
      enrollmentId: enrollment.id,
      batchId: enrollment.batchId,
      reason: input.reason,
      addedBy: adminUserId,
    });

    return item;
  }

  public async removeFromWatchlist(id: string) {
    const item = await this.repository.findById(id);
    if (!item) {
      throw new Error('Watchlist entry not found');
    }

    return await this.repository.removeFromWatchlist(id);
  }

  public async updateWatchlistReason(id: string, input: UpdateWatchlistInput) {
    const item = await this.repository.findById(id);
    if (!item) {
      throw new Error('Watchlist entry not found');
    }

    return await this.repository.updateReason(id, input.reason ?? null);
  }

  public async listWatchlist(query: ListWatchlistQuery) {
    const { items, pagination } = await this.repository.findWatchlistedLearners({
      batchId: query.batchId,
      search: query.q,
      page: query.page,
      limit: query.limit,
    });

    const formattedItems = items.map((item) => {
      const watched = item.lecturesWatched || 0;
      const totalLectures = item.totalLectures || 0;
      const submitted = item.assignmentsSubmitted || 0;
      const totalAssignments = item.totalAssignments || 0;

      const accessStartsFrom = item.startedAt || item.subscriptionActiveOn || item.createdAt;

      // Resolve latest activity timestamp
      let lastActiveAt = item.userLastActiveAt || item.latestProgressUpdatedAt || item.createdAt;
      if (item.userLastActiveAt && item.latestProgressUpdatedAt) {
        lastActiveAt = new Date(item.userLastActiveAt) > new Date(item.latestProgressUpdatedAt)
          ? item.userLastActiveAt
          : item.latestProgressUpdatedAt;
      }

      return {
        watchlistId: item.watchlistId,
        userId: item.userId,
        name: item.name,
        email: item.email,
        avatarUrl: item.avatarUrl,
        batchId: item.batchId,
        batchName: item.batchName,
        enrollmentId: item.enrollmentId,
        accessStartsFrom,
        progressPercent: item.progressPercent,
        timeSpentSeconds: item.timeSpentSeconds,
        formattedTimeSpent: formatSecondsToDuration(item.timeSpentSeconds),
        lectures: {
          watched,
          total: totalLectures,
          display: `${watched}/${totalLectures}`,
        },
        assignments: {
          submitted,
          total: totalAssignments,
          display: `${submitted}/${totalAssignments}`,
        },
        lastActiveAt,
        reason: item.reason,
        addedAt: item.addedAt,
      };
    });

    return {
      items: formattedItems,
      pagination,
    };
  }
}
