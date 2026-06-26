import { db } from '../../db/index.js';
import { batches } from '../../db/schema.js';
import { eq, or, ilike, sql } from 'drizzle-orm';

export type Batch = typeof batches.$inferSelect;
export type NewBatch = typeof batches.$inferInsert;

export class BatchRepository {
  public async findById(id: number): Promise<Batch | null> {
    const results = await db
      .select()
      .from(batches)
      .where(eq(batches.id, id))
      .limit(1);
    
    return results[0] || null;
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

  public async update(id: number, data: Partial<NewBatch>): Promise<Batch | null> {
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

  public async delete(id: number): Promise<boolean> {
    const results = await db
      .delete(batches)
      .where(eq(batches.id, id))
      .returning();
    
    return results.length > 0;
  }

  public async search(queryText: string, limit: number, offset: number): Promise<Batch[]> {
    if (!queryText) {
      return db
        .select()
        .from(batches)
        .limit(limit)
        .offset(offset);
    }

    const searchPattern = `%${queryText}%`;
    return db
      .select()
      .from(batches)
      .where(
        or(
          ilike(batches.name, searchPattern),
          ilike(batches.topic, searchPattern),
          ilike(batches.slug, searchPattern)
        )
      )
      .limit(limit)
      .offset(offset);
  }

  public async count(queryText: string): Promise<number> {
    if (!queryText) {
      const results = await db
        .select({ count: sql<number>`count(*)` })
        .from(batches);
      return Number(results[0]?.count || 0);
    }

    const searchPattern = `%${queryText}%`;
    const results = await db
      .select({ count: sql<number>`count(*)` })
      .from(batches)
      .where(
        or(
          ilike(batches.name, searchPattern),
          ilike(batches.topic, searchPattern),
          ilike(batches.slug, searchPattern)
        )
      );
    return Number(results[0]?.count || 0);
  }
}
