import { db } from '../../../db/index.js';
import { users, batchEnrollments, batchEnrollmentPayments, batches } from '../../../db/schema.js';
import { eq, and, gte, lte, sql, desc } from 'drizzle-orm';
import { type GroupInterval } from '../../../utils/date-range.js';

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

  public async getTableStats(): Promise<Array<{
    tableName: string;
    totalSizeBytes: number;
    totalSizePretty: string;
    tableSizeBytes: number;
    tableSizePretty: string;
    indexSizeBytes: number;
    indexSizePretty: string;
    rowCount: number;
  }>> {
    const statsResult = await db.execute(sql`
      SELECT 
        c.relname AS table_name,
        coalesce(pg_total_relation_size(c.oid), 0)::bigint AS total_size,
        coalesce(pg_relation_size(c.oid), 0)::bigint AS table_size,
        coalesce(pg_indexes_size(c.oid), 0)::bigint AS index_size,
        coalesce(c.reltuples, 0)::bigint AS row_count
      FROM 
        pg_class c
      JOIN 
        pg_namespace n ON n.oid = c.relnamespace
      WHERE 
        n.nspname = 'public' 
        AND c.relkind = 'r'
      ORDER BY 
        c.relname ASC
    `);

    const formatSize = (bytes: number) => {
      if (bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const statsPromises = statsResult.rows.map(async (row: any) => {
      const totalSize = Number(row.total_size);
      const tableSize = Number(row.table_size);
      const indexSize = Number(row.index_size);
      let rowCount = Number(row.row_count);

      // Hybrid approach: for tables under 50 MB, query the exact count.
      // For larger tables, fall back to pg_class estimates.
      const sizeThresholdBytes = 50 * 1024 * 1024; // 50 MB
      if (tableSize < sizeThresholdBytes) {
        try {
          const exactCountResult = await db.execute(sql`
            SELECT count(*) AS exact_count 
            FROM ${sql.identifier(row.table_name)}
          `);
          rowCount = Number(exactCountResult.rows[0]?.exact_count ?? rowCount);
        } catch (e) {
          // Fall back silently to estimate on error
        }
      }

      return {
        tableName: row.table_name,
        totalSizeBytes: totalSize,
        totalSizePretty: formatSize(totalSize),
        tableSizeBytes: tableSize,
        tableSizePretty: formatSize(tableSize),
        indexSizeBytes: indexSize,
        indexSizePretty: formatSize(indexSize),
        rowCount,
      };
    });

    return Promise.all(statsPromises);
  }

  public async getSignupTrend(from: Date, to: Date, interval: GroupInterval) {
    const { trunc, format } = getSqlFormatAndTrunc(interval);
    const bucketExpr = sql<string>`to_char(date_trunc(${trunc}, ${users.createdAt}), ${format})`;
    
    return db
      .select({
        bucket: bucketExpr,
        count: sql<number>`cast(count(*) as integer)`
      })
      .from(users)
      .where(and(
        gte(users.createdAt, from),
        lte(users.createdAt, to)
      ))
      .groupBy(bucketExpr);
  }

  public async getEnrollmentTrend(from: Date, to: Date, interval: GroupInterval) {
    const { trunc, format } = getSqlFormatAndTrunc(interval);
    const bucketExpr = sql<string>`to_char(date_trunc(${trunc}, ${batchEnrollments.createdAt}), ${format})`;
    
    return db
      .select({
        bucket: bucketExpr,
        count: sql<number>`cast(count(*) as integer)`
      })
      .from(batchEnrollments)
      .where(and(
        gte(batchEnrollments.createdAt, from),
        lte(batchEnrollments.createdAt, to),
        eq(batchEnrollments.paymentStatus, 'captured')
      ))
      .groupBy(bucketExpr);
  }

  public async getRevenueTrend(from: Date, to: Date, interval: GroupInterval) {
    const { trunc, format } = getSqlFormatAndTrunc(interval);
    const bucketExpr = sql<string>`to_char(date_trunc(${trunc}, ${batchEnrollmentPayments.paidAt}), ${format})`;
    
    return db
      .select({
        bucket: bucketExpr,
        sum: sql<number>`cast(coalesce(sum(${batchEnrollmentPayments.amount}), 0) as integer)`
      })
      .from(batchEnrollmentPayments)
      .where(and(
        gte(batchEnrollmentPayments.paidAt, from),
        lte(batchEnrollmentPayments.paidAt, to)
      ))
      .groupBy(bucketExpr);
  }
}

function getSqlFormatAndTrunc(interval: GroupInterval) {
  if (interval === 'hour') {
    return {
      trunc: 'hour',
      format: 'YYYY-MM-DD HH24:mi'
    };
  }
  if (interval === 'day') {
    return {
      trunc: 'day',
      format: 'YYYY-MM-DD'
    };
  }
  return {
    trunc: 'month',
    format: 'YYYY-MM'
  };
}
