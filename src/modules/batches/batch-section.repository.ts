import { db } from '../../db/index.js';
import { batchSections } from '../../db/schema.js';
import { eq, ilike, sql, and } from 'drizzle-orm';

export type BatchSection = typeof batchSections.$inferSelect;
export type NewBatchSection = typeof batchSections.$inferInsert;

export class BatchSectionRepository {
  public async findById(id: number): Promise<BatchSection | null> {
    const results = await db
      .select()
      .from(batchSections)
      .where(eq(batchSections.id, id))
      .limit(1);
    
    return results[0] || null;
  }

  public async create(data: NewBatchSection): Promise<BatchSection> {
    const results = await db
      .insert(batchSections)
      .values(data)
      .returning();
    
    return results[0];
  }

  public async update(id: number, data: Partial<NewBatchSection>): Promise<BatchSection | null> {
    const results = await db
      .update(batchSections)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(batchSections.id, id))
      .returning();
    
    return results[0] || null;
  }

  public async delete(id: number): Promise<boolean> {
    const results = await db
      .delete(batchSections)
      .where(eq(batchSections.id, id))
      .returning();
    
    return results.length > 0;
  }

  public async search(queryText: string, limit: number, offset: number, batchId?: number): Promise<BatchSection[]> {
    let query = db.select().from(batchSections).$dynamic();
    
    const conditions = [];
    if (queryText) {
      conditions.push(ilike(batchSections.title, `%${queryText}%`));
    }
    if (batchId !== undefined) {
      conditions.push(eq(batchSections.batchId, batchId));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return query.limit(limit).offset(offset);
  }

  public async count(queryText: string, batchId?: number): Promise<number> {
    let query = db.select({ count: sql<number>`count(*)` }).from(batchSections).$dynamic();
    
    const conditions = [];
    if (queryText) {
      conditions.push(ilike(batchSections.title, `%${queryText}%`));
    }
    if (batchId !== undefined) {
      conditions.push(eq(batchSections.batchId, batchId));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query;
    return Number(results[0]?.count || 0);
  }
}
