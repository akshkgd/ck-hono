import { db } from '../../db/index.js';
import { batches, batchEnrollments } from '../../db/schema.js';
import { eq, or, ilike, sql, and } from 'drizzle-orm';

export type Batch = typeof batches.$inferSelect;
export type NewBatch = typeof batches.$inferInsert;

export class BatchRepository {
  public async findById(id: string): Promise<Batch | null> {
    const results = await db
      .select()
      .from(batches)
      .where(eq(batches.id, id))
      .limit(1);
    
    return results[0] || null;
  }

  public async getBatchStats(batchId: string) {
    const stats = await db
      .select({
        totalEnrollments: sql<number>`cast(count(${batchEnrollments.id}) as integer)`,
        totalRevenue: sql<number>`cast(coalesce(sum(case when ${batchEnrollments.paymentStatus} = 'captured' then ${batchEnrollments.amountPaid} else 0 end), 0) as integer)`
      })
      .from(batchEnrollments)
      .where(eq(batchEnrollments.batchId, batchId));
    return stats[0] || { totalEnrollments: 0, totalRevenue: 0 };
  }

  public async findBySlug(slug: string): Promise<Batch | null> {
    const results = await db
      .select()
      .from(batches)
      .where(eq(batches.slug, slug))
      .limit(1);
    
    return results[0] || null;
  }

  public async create(batchData: NewBatch): Promise<Batch> {
    const results = await db
      .insert(batches)
      .values(batchData)
      .returning();
    
    return results[0];
  }

  public async update(id: string, data: Partial<NewBatch>): Promise<Batch | null> {
    const results = await db
      .update(batches)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(batches.id, id))
      .returning();
    
    return results[0] || null;
  }

  public async delete(id: string): Promise<boolean> {
    const results = await db
      .delete(batches)
      .where(eq(batches.id, id))
      .returning();
    
    return results.length > 0;
  }

  public async search(queryText: string, limit: number, offset: number, type?: string, status?: string): Promise<Batch[]> {
    let query = db
      .select()
      .from(batches)
      .$dynamic();

    const conditions = [];

    if (queryText) {
      const searchPattern = `%${queryText}%`;
      conditions.push(
        or(
          ilike(batches.name, searchPattern),
          ilike(batches.topic, searchPattern),
          ilike(batches.slug, searchPattern)
        )
      );
    }

    if (type) {
      conditions.push(eq(batches.type, type as any));
    }

    if (status) {
      conditions.push(eq(batches.status, status as any));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return query.limit(limit).offset(offset);
  }

  public async count(queryText: string, type?: string, status?: string): Promise<number> {
    let query = db
      .select({ count: sql<number>`count(*)` })
      .from(batches)
      .$dynamic();

    const conditions = [];

    if (queryText) {
      const searchPattern = `%${queryText}%`;
      conditions.push(
        or(
          ilike(batches.name, searchPattern),
          ilike(batches.topic, searchPattern),
          ilike(batches.slug, searchPattern)
        )
      );
    }

    if (type) {
      conditions.push(eq(batches.type, type as any));
    }

    if (status) {
      conditions.push(eq(batches.status, status as any));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query;
    return Number(results[0]?.count || 0);
  }
}
