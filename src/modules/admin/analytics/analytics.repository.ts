import { db } from '../../../db/index.js';
import { users, batchEnrollments, batchEnrollmentPayments, batches } from '../../../db/schema.js';
import { eq, and, gte, lte, sql, desc } from 'drizzle-orm';

export class AnalyticsRepository {
  public async countSignups(from: Date, to: Date): Promise<number> {
    const results = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(and(
        gte(users.createdAt, from),
        lte(users.createdAt, to)
      ));
    return Number(results[0]?.count || 0);
  }

  public async countEnrollments(from: Date, to: Date): Promise<number> {
    const results = await db
      .select({ count: sql<number>`count(*)` })
      .from(batchEnrollments)
      .where(and(
        gte(batchEnrollments.createdAt, from),
        lte(batchEnrollments.createdAt, to),
        eq(batchEnrollments.paymentStatus, 'captured')
      ));
    return Number(results[0]?.count || 0);
  }

  public async calculateRevenue(from: Date, to: Date): Promise<number> {
    const results = await db
      .select({ sum: sql<number>`coalesce(sum(${batchEnrollmentPayments.amount}), 0)` })
      .from(batchEnrollmentPayments)
      .where(and(
        gte(batchEnrollmentPayments.paidAt, from),
        lte(batchEnrollmentPayments.paidAt, to)
      ));
    return Number(results[0]?.sum || 0);
  }

  public async listEnrollments(from: Date, to: Date, limit: number, offset: number) {
    return db
      .select({
        id: batchEnrollments.id,
        userId: batchEnrollments.userId,
        batchId: batchEnrollments.batchId,
        amountPayable: batchEnrollments.amountPayable,
        enrollmentType: batchEnrollments.enrollmentType,
        status: batchEnrollments.status,
        progress: batchEnrollments.progress,
        timeSpentSeconds: batchEnrollments.timeSpentSeconds,
        paymentStatus: batchEnrollments.paymentStatus,
        createdAt: batchEnrollments.createdAt,
        user: {
          name: users.name,
          email: users.email,
          mobile: users.mobile,
        },
        batch: {
          name: batches.name,
        }
      })
      .from(batchEnrollments)
      .leftJoin(users, eq(batchEnrollments.userId, users.id))
      .leftJoin(batches, eq(batchEnrollments.batchId, batches.id))
      .where(and(
        gte(batchEnrollments.createdAt, from),
        lte(batchEnrollments.createdAt, to)
      ))
      .orderBy(desc(batchEnrollments.createdAt))
      .limit(limit)
      .offset(offset);
  }

  public async countEnrollmentsTotal(from: Date, to: Date): Promise<number> {
    const results = await db
      .select({ count: sql<number>`count(*)` })
      .from(batchEnrollments)
      .where(and(
        gte(batchEnrollments.createdAt, from),
        lte(batchEnrollments.createdAt, to)
      ));
    return Number(results[0]?.count || 0);
  }
}
