import { db } from '../../db/index.js';
import { contentLibrary } from '../../db/schema.js';
import { eq, ilike, sql, and } from 'drizzle-orm';

export type ContentLibraryItem = typeof contentLibrary.$inferSelect;
export type NewContentLibraryItem = typeof contentLibrary.$inferInsert;

export class ContentLibraryRepository {
  public async findById(id: number): Promise<ContentLibraryItem | null> {
    const results = await db
      .select()
      .from(contentLibrary)
      .where(eq(contentLibrary.id, id))
      .limit(1);
    
    return results[0] || null;
  }

  public async create(data: NewContentLibraryItem): Promise<ContentLibraryItem> {
    const results = await db
      .insert(contentLibrary)
      .values(data)
      .returning();
    
    return results[0];
  }

  public async update(id: number, data: Partial<NewContentLibraryItem>): Promise<ContentLibraryItem | null> {
    const results = await db
      .update(contentLibrary)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(contentLibrary.id, id))
      .returning();
    
    return results[0] || null;
  }

  public async delete(id: number): Promise<boolean> {
    const results = await db
      .delete(contentLibrary)
      .where(eq(contentLibrary.id, id))
      .returning();
    
    return results.length > 0;
  }

  public async search(queryText: string, limit: number, offset: number, type?: 'video' | 'coding lab' | 'assignment' | 'article'): Promise<ContentLibraryItem[]> {
    let query = db.select().from(contentLibrary).$dynamic();
    
    const conditions = [];
    if (queryText) {
      conditions.push(ilike(contentLibrary.title, `%${queryText}%`));
    }
    if (type !== undefined) {
      conditions.push(eq(contentLibrary.type, type));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return query.limit(limit).offset(offset);
  }

  public async count(queryText: string, type?: 'video' | 'coding lab' | 'assignment' | 'article'): Promise<number> {
    let query = db.select({ count: sql<number>`count(*)` }).from(contentLibrary).$dynamic();
    
    const conditions = [];
    if (queryText) {
      conditions.push(ilike(contentLibrary.title, `%${queryText}%`));
    }
    if (type !== undefined) {
      conditions.push(eq(contentLibrary.type, type));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query;
    return Number(results[0]?.count || 0);
  }
}
