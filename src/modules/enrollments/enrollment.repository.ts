import { db } from '../../db/index.js';
import { batchEnrollments, users, batches, batchEnrollmentPayments } from '../../db/schema.js';
import { eq, or, ilike, sql, and, asc, desc } from 'drizzle-orm';

export type Enrollment = typeof batchEnrollments.$inferSelect;
export type NewEnrollment = typeof batchEnrollments.$inferInsert;

export class EnrollmentRepository {
  public async findById(id: number) {
    const results = await db
      .select({
        id: batchEnrollments.id,
        userId: batchEnrollments.userId,
        batchId: batchEnrollments.batchId,
        amountPayable: batchEnrollments.amountPayable,
        enrollmentType: batchEnrollments.enrollmentType,
        status: batchEnrollments.status,
        progress: batchEnrollments.progress,
        timeSpentSeconds: batchEnrollments.timeSpentSeconds,
        amountPaid: batchEnrollments.amountPaid,
        certificateFee: batchEnrollments.certificateFee,
        paymentStatus: batchEnrollments.paymentStatus,
        paymentMethod: batchEnrollments.paymentMethod,
        couponCode: batchEnrollments.couponCode,
        transactionId: batchEnrollments.transactionId,
        invoiceId: batchEnrollments.invoiceId,
        subscriptionId: batchEnrollments.subscriptionId,
        subscriptionStatus: batchEnrollments.subscriptionStatus,
        subscriptionActiveOn: batchEnrollments.subscriptionActiveOn,
        subscriptionExpiresOn: batchEnrollments.subscriptionExpiresOn,
        paidAt: batchEnrollments.paidAt,
        certificateId: batchEnrollments.certificateId,
        certificateGeneratedAt: batchEnrollments.certificateGeneratedAt,
        startedAt: batchEnrollments.startedAt,
        accessTill: batchEnrollments.accessTill,
        overrideAccessDays: batchEnrollments.overrideAccessDays,
        utmSource: batchEnrollments.utmSource,
        utmMedium: batchEnrollments.utmMedium,
        utmCampaign: batchEnrollments.utmCampaign,
        remark: batchEnrollments.remark,
        metadata: batchEnrollments.metadata,
        createdAt: batchEnrollments.createdAt,
        updatedAt: batchEnrollments.updatedAt,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
          mobile: users.mobile,
        },
        batch: {
          id: batches.id,
          name: batches.name,
          slug: batches.slug,
        }
      })
      .from(batchEnrollments)
      .leftJoin(users, eq(batchEnrollments.userId, users.id))
      .leftJoin(batches, eq(batchEnrollments.batchId, batches.id))
      .where(eq(batchEnrollments.id, id))
      .limit(1);

    return results[0] || null;
  }

  public async findByCertificateId(certificateId: string): Promise<Enrollment | null> {
    const results = await db
      .select()
      .from(batchEnrollments)
      .where(eq(batchEnrollments.certificateId, certificateId))
      .limit(1);

    return results[0] || null;
  }

  public async create(data: NewEnrollment): Promise<Enrollment> {
    const results = await db
      .insert(batchEnrollments)
      .values(data)
      .returning();

    return results[0];
  }

  public async update(id: number, data: Partial<NewEnrollment>): Promise<Enrollment | null> {
    const results = await db
      .update(batchEnrollments)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(batchEnrollments.id, id))
      .returning();

    return results[0] || null;
  }

  public async delete(id: number): Promise<boolean> {
    const results = await db
      .delete(batchEnrollments)
      .where(eq(batchEnrollments.id, id))
      .returning();

    return results.length > 0;
  }

  public async search(
    queryText: string,
    limit: number,
    offset: number,
    batchId?: number,
    userId?: string,
    paymentStatus?: 'captured' | 'failed' | 'created' | 'refunded',
    sortBy: 'createdAt' | 'progress' | 'amountPaid' | 'timeSpentSeconds' = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc'
  ) {
    let query = db
      .select({
        id: batchEnrollments.id,
        userId: batchEnrollments.userId,
        batchId: batchEnrollments.batchId,
        amountPayable: batchEnrollments.amountPayable,
        amountPaid: batchEnrollments.amountPaid,
        paidAt: batchEnrollments.paidAt,
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
      .$dynamic();

    const conditions = [];
    if (queryText) {
      const searchPattern = `%${queryText}%`;
      conditions.push(
        or(
          ilike(users.name, searchPattern),
          ilike(users.email, searchPattern),
          ilike(batches.name, searchPattern),
          ilike(batchEnrollments.couponCode, searchPattern),
          ilike(batchEnrollments.transactionId, searchPattern)
        )
      );
    }
    if (batchId !== undefined) {
      conditions.push(eq(batchEnrollments.batchId, batchId));
    }
    if (userId !== undefined) {
      conditions.push(eq(batchEnrollments.userId, userId));
    }
    if (paymentStatus) {
      conditions.push(eq(batchEnrollments.paymentStatus, paymentStatus));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    let orderColumn;
    switch (sortBy) {
      case 'progress':
        orderColumn = batchEnrollments.progress;
        break;
      case 'amountPaid':
        orderColumn = batchEnrollments.amountPaid;
        break;
      case 'timeSpentSeconds':
        orderColumn = batchEnrollments.timeSpentSeconds;
        break;
      case 'createdAt':
      default:
        orderColumn = batchEnrollments.createdAt;
        break;
    }

    const sortFn = sortOrder === 'asc' ? asc : desc;
    const orderByClause = orderColumn ? sortFn(orderColumn) : desc(batchEnrollments.createdAt);

    return query.orderBy(orderByClause).limit(limit).offset(offset);
  }

  public async count(
    queryText: string,
    batchId?: number,
    userId?: string,
    paymentStatus?: 'captured' | 'failed' | 'created' | 'refunded'
  ): Promise<number> {
    const conditions = [];
    if (batchId !== undefined) {
      conditions.push(eq(batchEnrollments.batchId, batchId));
    }
    if (userId !== undefined) {
      conditions.push(eq(batchEnrollments.userId, userId));
    }
    if (paymentStatus) {
      conditions.push(eq(batchEnrollments.paymentStatus, paymentStatus));
    }

    let query;
    if (queryText) {
      const searchPattern = `%${queryText}%`;
      conditions.push(
        or(
          ilike(users.name, searchPattern),
          ilike(users.email, searchPattern),
          ilike(batches.name, searchPattern)
        )
      );
      query = db
        .select({ count: sql<number>`count(*)` })
        .from(batchEnrollments)
        .leftJoin(users, eq(batchEnrollments.userId, users.id))
        .leftJoin(batches, eq(batchEnrollments.batchId, batches.id))
        .$dynamic();
    } else {
      query = db
        .select({ count: sql<number>`count(*)` })
        .from(batchEnrollments)
        .$dynamic();
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query;
    return Number(results[0]?.count || 0);
  }

  public async findByUserId(userId: string) {
    return db
      .select({
        id: batchEnrollments.id,
        batchId: batchEnrollments.batchId,
        amountPayable: batchEnrollments.amountPayable,
        enrollmentType: batchEnrollments.enrollmentType,
        status: batchEnrollments.status,
        progress: batchEnrollments.progress,
        timeSpentSeconds: batchEnrollments.timeSpentSeconds,
        amountPaid: batchEnrollments.amountPaid,
        paymentStatus: batchEnrollments.paymentStatus,
        createdAt: batchEnrollments.createdAt,
        batchName: batches.name,
        batchSlug: batches.slug,
        batchType: batches.type,
      })
      .from(batchEnrollments)
      .leftJoin(batches, eq(batchEnrollments.batchId, batches.id))
      .where(eq(batchEnrollments.userId, userId));
   }

  public async recalculateAmountPaid(enrollmentId: number): Promise<number> {
    const enrollment = await db
      .select({
        amountPayable: batchEnrollments.amountPayable,
        paymentStatus: batchEnrollments.paymentStatus,
      })
      .from(batchEnrollments)
      .where(eq(batchEnrollments.id, enrollmentId))
      .limit(1)
      .then((res) => res[0]);

    if (!enrollment) {
      return 0;
    }

    // Sum non-refunds and subtract refunds
    const sumResult = await db
      .select({
        sum: sql<number>`coalesce(sum(case when ${batchEnrollmentPayments.purpose} = 'refund' then -${batchEnrollmentPayments.amount} else ${batchEnrollmentPayments.amount} end), 0)`
      })
      .from(batchEnrollmentPayments)
      .where(eq(batchEnrollmentPayments.batchEnrollmentId, enrollmentId));

    const totalPaid = Number(sumResult[0]?.sum || 0);

    // Count existing payments
    const paymentsCountResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(batchEnrollmentPayments)
      .where(eq(batchEnrollmentPayments.batchEnrollmentId, enrollmentId));
    const hasPayments = Number(paymentsCountResult[0]?.count || 0) > 0;

    // Check if there is any refund transaction
    const hasRefund = await db
      .select({ id: batchEnrollmentPayments.id })
      .from(batchEnrollmentPayments)
      .where(
        and(
          eq(batchEnrollmentPayments.batchEnrollmentId, enrollmentId),
          eq(batchEnrollmentPayments.purpose, 'refund')
        )
      )
      .limit(1)
      .then((res) => res.length > 0);

    const payable = enrollment.amountPayable ?? 0;
    let newStatus = enrollment.paymentStatus;

    if (hasRefund && totalPaid <= 0) {
      newStatus = 'refunded';
    } else if (hasPayments && totalPaid >= payable) {
      newStatus = 'captured';
    } else if (hasPayments && totalPaid < payable) {
      newStatus = 'created';
    } else if (!hasPayments) {
      newStatus = 'created';
    }

    // Find the latest payment date to update paidAt if appropriate
    const latestPaymentResult = await db
      .select({ paidAt: batchEnrollmentPayments.paidAt })
      .from(batchEnrollmentPayments)
      .where(eq(batchEnrollmentPayments.batchEnrollmentId, enrollmentId))
      .orderBy(desc(batchEnrollmentPayments.paidAt))
      .limit(1);
    const latestPaidAt = latestPaymentResult[0]?.paidAt || null;

    const updateData: any = {
      amountPaid: totalPaid,
      paymentStatus: newStatus,
    };

    if (newStatus === 'captured' && latestPaidAt) {
      updateData.paidAt = latestPaidAt;
    }

    await db
      .update(batchEnrollments)
      .set(updateData)
      .where(eq(batchEnrollments.id, enrollmentId));

    return totalPaid;
  }

  public async findByUserAndBatch(userId: string, batchId: number): Promise<Enrollment | null> {
    const results = await db
      .select()
      .from(batchEnrollments)
      .where(
        and(
          eq(batchEnrollments.userId, userId),
          eq(batchEnrollments.batchId, batchId)
        )
      )
      .limit(1);

    return results[0] || null;
  }
}
