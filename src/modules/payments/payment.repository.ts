import { db } from '../../db/index.js';
import { batchEnrollmentPayments, batchEnrollments, users, batches } from '../../db/schema.js';
import { eq, or, ilike, sql, and, gte, lte, asc, desc, inArray } from 'drizzle-orm';

export type Payment = typeof batchEnrollmentPayments.$inferSelect;
export type NewPayment = typeof batchEnrollmentPayments.$inferInsert;

export class PaymentRepository {
  public async findById(id: string) {
    const results = await db
      .select({
        id: batchEnrollmentPayments.id,
        batchEnrollmentId: batchEnrollmentPayments.batchEnrollmentId,
        amount: batchEnrollmentPayments.amount,
        paidAt: batchEnrollmentPayments.paidAt,
        paymentMethod: batchEnrollmentPayments.paymentMethod,
        transactionId: batchEnrollmentPayments.transactionId,
        invoiceId: batchEnrollmentPayments.invoiceId,
        purpose: batchEnrollmentPayments.purpose,
        isGstApplicable: batchEnrollmentPayments.isGstApplicable,
        remarks: batchEnrollmentPayments.remarks,
        metadata: batchEnrollmentPayments.metadata,
        createdAt: batchEnrollmentPayments.createdAt,
        updatedAt: batchEnrollmentPayments.updatedAt,
        enrollment: {
          id: batchEnrollments.id,
          userId: batchEnrollments.userId,
          batchId: batchEnrollments.batchId,
        },
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
        batch: {
          id: batches.id,
          name: batches.name,
        }
      })
      .from(batchEnrollmentPayments)
      .leftJoin(batchEnrollments, eq(batchEnrollmentPayments.batchEnrollmentId, batchEnrollments.id))
      .leftJoin(users, eq(batchEnrollments.userId, users.id))
      .leftJoin(batches, eq(batchEnrollments.batchId, batches.id))
      .where(eq(batchEnrollmentPayments.id, id))
      .limit(1);

    return results[0] || null;
  }

  public async findByTransactionId(transactionId: string, tx: any = db): Promise<Payment | null> {
    const results = await tx
      .select()
      .from(batchEnrollmentPayments)
      .where(eq(batchEnrollmentPayments.transactionId, transactionId))
      .limit(1);

    return results[0] || null;
  }

  public async findByInvoiceId(invoiceId: string, tx: any = db): Promise<Payment | null> {
    const results = await tx
      .select()
      .from(batchEnrollmentPayments)
      .where(eq(batchEnrollmentPayments.invoiceId, invoiceId))
      .limit(1);

    return results[0] || null;
  }

  public async create(data: NewPayment, tx: any = db): Promise<Payment> {
    const results = await tx
      .insert(batchEnrollmentPayments)
      .values(data)
      .returning();

    return results[0];
  }

  public async update(id: string, data: Partial<NewPayment>): Promise<Payment | null> {
    const results = await db
      .update(batchEnrollmentPayments)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(batchEnrollmentPayments.id, id))
      .returning();

    return results[0] || null;
  }

  public async delete(id: string): Promise<boolean> {
    const results = await db
      .delete(batchEnrollmentPayments)
      .where(eq(batchEnrollmentPayments.id, id))
      .returning();

    return results.length > 0;
  }

  public async search(queryText: string, limit: number, offset: number, batchEnrollmentId?: string) {
    let query = db
      .select({
        id: batchEnrollmentPayments.id,
        batchEnrollmentId: batchEnrollmentPayments.batchEnrollmentId,
        amount: batchEnrollmentPayments.amount,
        paidAt: batchEnrollmentPayments.paidAt,
        paymentMethod: batchEnrollmentPayments.paymentMethod,
        transactionId: batchEnrollmentPayments.transactionId,
        invoiceId: batchEnrollmentPayments.invoiceId,
        purpose: batchEnrollmentPayments.purpose,
        isGstApplicable: batchEnrollmentPayments.isGstApplicable,
        user: {
          name: users.name,
          email: users.email,
        },
        batch: {
          name: batches.name,
        }
      })
      .from(batchEnrollmentPayments)
      .leftJoin(batchEnrollments, eq(batchEnrollmentPayments.batchEnrollmentId, batchEnrollments.id))
      .leftJoin(users, eq(batchEnrollments.userId, users.id))
      .leftJoin(batches, eq(batchEnrollments.batchId, batches.id));

    const conditions = [];
    if (batchEnrollmentId) {
      conditions.push(eq(batchEnrollmentPayments.batchEnrollmentId, batchEnrollmentId));
    }
    if (queryText) {
      const searchPattern = `%${queryText}%`;
      conditions.push(
        or(
          ilike(users.name, searchPattern),
          ilike(users.email, searchPattern),
          ilike(batches.name, searchPattern),
          ilike(batchEnrollmentPayments.transactionId, searchPattern),
          ilike(batchEnrollmentPayments.invoiceId, searchPattern),
          ilike(batchEnrollmentPayments.paymentMethod, searchPattern)
        )
      );
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    return query.limit(limit).offset(offset);
  }

  public async count(queryText: string, batchEnrollmentId?: string): Promise<number> {
    let query = db
      .select({ count: sql<number>`count(*)` })
      .from(batchEnrollmentPayments)
      .leftJoin(batchEnrollments, eq(batchEnrollmentPayments.batchEnrollmentId, batchEnrollments.id))
      .leftJoin(users, eq(batchEnrollments.userId, users.id))
      .leftJoin(batches, eq(batchEnrollments.batchId, batches.id));

    const conditions = [];
    if (batchEnrollmentId) {
      conditions.push(eq(batchEnrollmentPayments.batchEnrollmentId, batchEnrollmentId));
    }
    if (queryText) {
      const searchPattern = `%${queryText}%`;
      conditions.push(
        or(
          ilike(users.name, searchPattern),
          ilike(users.email, searchPattern),
          ilike(batches.name, searchPattern),
          ilike(batchEnrollmentPayments.transactionId, searchPattern),
          ilike(batchEnrollmentPayments.invoiceId, searchPattern)
        )
      );
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    const results = await query;
    return Number(results[0]?.count || 0);
  }

  public async searchTransactions(
    queryText: string,
    limit: number,
    offset: number,
    sortOrder: 'asc' | 'desc' = 'desc',
    startDate?: Date,
    endDate?: Date,
    isGstApplicable?: boolean | null,
    type?: 'all' | 'course' | 'webinar'
  ) {
    let query = db
      .select({
        id: batchEnrollmentPayments.id,
        batchEnrollmentId: batchEnrollmentPayments.batchEnrollmentId,
        amount: batchEnrollmentPayments.amount,
        paidAt: batchEnrollmentPayments.paidAt,
        paymentMethod: batchEnrollmentPayments.paymentMethod,
        transactionId: batchEnrollmentPayments.transactionId,
        invoiceId: batchEnrollmentPayments.invoiceId,
        purpose: batchEnrollmentPayments.purpose,
        isGstApplicable: batchEnrollmentPayments.isGstApplicable,
        remarks: batchEnrollmentPayments.remarks,
        createdAt: batchEnrollmentPayments.createdAt,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
        batch: {
          id: batches.id,
          name: batches.name,
        }
      })
      .from(batchEnrollmentPayments)
      .leftJoin(batchEnrollments, eq(batchEnrollmentPayments.batchEnrollmentId, batchEnrollments.id))
      .leftJoin(users, eq(batchEnrollments.userId, users.id))
      .leftJoin(batches, eq(batchEnrollments.batchId, batches.id));

    const conditions = [];
    if (queryText) {
      const searchPattern = `%${queryText}%`;
      conditions.push(
        or(
          ilike(users.name, searchPattern),
          ilike(users.email, searchPattern),
          ilike(batches.name, searchPattern),
          ilike(batchEnrollmentPayments.transactionId, searchPattern),
          ilike(batchEnrollmentPayments.invoiceId, searchPattern)
        )
      );
    }
    if (startDate) {
      conditions.push(gte(batchEnrollmentPayments.paidAt, startDate));
    }
    if (endDate) {
      conditions.push(lte(batchEnrollmentPayments.paidAt, endDate));
    }
    if (isGstApplicable !== undefined && isGstApplicable !== null) {
      conditions.push(eq(batchEnrollmentPayments.isGstApplicable, isGstApplicable));
    }
    if (type === 'course') {
      conditions.push(inArray(batches.type, ['cohort', 'live', 'mentorship']));
    } else if (type === 'webinar') {
      conditions.push(inArray(batches.type, ['webinar', 'callBooking']));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    const sortFn = sortOrder === 'asc' ? asc : desc;
    query = query.orderBy(sortFn(batchEnrollmentPayments.paidAt)) as any;

    return query.limit(limit).offset(offset);
  }

  public async countTransactions(
    queryText: string,
    startDate?: Date,
    endDate?: Date,
    isGstApplicable?: boolean | null,
    type?: 'all' | 'course' | 'webinar'
  ): Promise<number> {
    let query = db
      .select({ count: sql<number>`count(*)` })
      .from(batchEnrollmentPayments)
      .leftJoin(batchEnrollments, eq(batchEnrollmentPayments.batchEnrollmentId, batchEnrollments.id))
      .leftJoin(users, eq(batchEnrollments.userId, users.id))
      .leftJoin(batches, eq(batchEnrollments.batchId, batches.id));

    const conditions = [];
    if (queryText) {
      const searchPattern = `%${queryText}%`;
      conditions.push(
        or(
          ilike(users.name, searchPattern),
          ilike(users.email, searchPattern),
          ilike(batches.name, searchPattern),
          ilike(batchEnrollmentPayments.transactionId, searchPattern),
          ilike(batchEnrollmentPayments.invoiceId, searchPattern)
        )
      );
    }
    if (startDate) {
      conditions.push(gte(batchEnrollmentPayments.paidAt, startDate));
    }
    if (endDate) {
      conditions.push(lte(batchEnrollmentPayments.paidAt, endDate));
    }
    if (isGstApplicable !== undefined && isGstApplicable !== null) {
      conditions.push(eq(batchEnrollmentPayments.isGstApplicable, isGstApplicable));
    }
    if (type === 'course') {
      conditions.push(inArray(batches.type, ['cohort', 'live', 'mentorship']));
    } else if (type === 'webinar') {
      conditions.push(inArray(batches.type, ['webinar', 'callBooking']));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    const results = await query;
    return Number(results[0]?.count || 0);
  }

  public async getTransactionsSummary(
    queryText: string,
    startDate?: Date,
    endDate?: Date,
    isGstApplicable?: boolean | null,
    type?: 'all' | 'course' | 'webinar'
  ): Promise<{ totalCollected: number; paymentCount: number; amountWithoutGst: number }> {
    let query = db
      .select({
        totalCollected: sql<number>`coalesce(sum(${batchEnrollmentPayments.amount}), 0)`,
        paymentCount: sql<number>`count(*)`,
        amountWithoutGst: sql<number>`coalesce(sum(CASE WHEN ${batchEnrollmentPayments.isGstApplicable} = true THEN ${batchEnrollmentPayments.amount} / 1.18 ELSE ${batchEnrollmentPayments.amount} END), 0)`
      })
      .from(batchEnrollmentPayments)
      .leftJoin(batchEnrollments, eq(batchEnrollmentPayments.batchEnrollmentId, batchEnrollments.id))
      .leftJoin(users, eq(batchEnrollments.userId, users.id))
      .leftJoin(batches, eq(batchEnrollments.batchId, batches.id));

    const conditions = [];
    if (queryText) {
      const searchPattern = `%${queryText}%`;
      conditions.push(
        or(
          ilike(users.name, searchPattern),
          ilike(users.email, searchPattern),
          ilike(batches.name, searchPattern),
          ilike(batchEnrollmentPayments.transactionId, searchPattern),
          ilike(batchEnrollmentPayments.invoiceId, searchPattern)
        )
      );
    }
    if (startDate) {
      conditions.push(gte(batchEnrollmentPayments.paidAt, startDate));
    }
    if (endDate) {
      conditions.push(lte(batchEnrollmentPayments.paidAt, endDate));
    }
    if (isGstApplicable !== undefined && isGstApplicable !== null) {
      conditions.push(eq(batchEnrollmentPayments.isGstApplicable, isGstApplicable));
    }
    if (type === 'course') {
      conditions.push(inArray(batches.type, ['cohort', 'live', 'mentorship']));
    } else if (type === 'webinar') {
      conditions.push(inArray(batches.type, ['webinar', 'callBooking']));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    const results = await query;
    const totalCollected = Number(results[0]?.totalCollected || 0);
    const paymentCount = Number(results[0]?.paymentCount || 0);
    const amountWithoutGst = parseFloat(Number(results[0]?.amountWithoutGst || 0).toFixed(2));

    return {
      totalCollected,
      paymentCount,
      amountWithoutGst
    };
  }
}
