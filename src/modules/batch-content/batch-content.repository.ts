import { db } from '../../db/index.js';
import { batchContent, batches, batchSections, contentLibrary } from '../../db/schema.js';
import { eq, and, sql } from 'drizzle-orm';

export type BatchContent = typeof batchContent.$inferSelect;
export type NewBatchContent = typeof batchContent.$inferInsert;

export class BatchContentRepository {
  public async findById(id: number) {
    const results = await db
      .select({
        id: batchContent.id,
        batchId: batchContent.batchId,
        contentId: batchContent.contentId,
        sectionId: batchContent.sectionId,
        order: batchContent.order,
        accessOn: batchContent.accessOn,
        accessTill: batchContent.accessTill,
        accessOnDate: batchContent.accessOnDate,
        accessTillDate: batchContent.accessTillDate,
        metadata: batchContent.metadata,
        createdAt: batchContent.createdAt,
        updatedAt: batchContent.updatedAt,
        batch: {
          name: batches.name,
        },
        section: {
          title: batchSections.title,
        },
        content: {
          title: contentLibrary.title,
          type: contentLibrary.type,
        }
      })
      .from(batchContent)
      .leftJoin(batches, eq(batchContent.batchId, batches.id))
      .leftJoin(batchSections, eq(batchContent.sectionId, batchSections.id))
      .leftJoin(contentLibrary, eq(batchContent.contentId, contentLibrary.id))
      .where(eq(batchContent.id, id))
      .limit(1);

    return results[0] || null;
  }

  public async create(data: NewBatchContent): Promise<BatchContent> {
    let orderToUse = data.order;

    if (orderToUse === undefined || orderToUse === null) {
      // Find current max order for this section
      const maxOrderResult = await db
        .select({ maxOrder: sql<number>`max(${batchContent.order})` })
        .from(batchContent)
        .where(eq(batchContent.sectionId, data.sectionId));

      const currentMax = maxOrderResult[0]?.maxOrder ?? 0;
      orderToUse = currentMax + 1;
    }

    const results = await db
      .insert(batchContent)
      .values({
        ...data,
        order: orderToUse,
      })
      .returning();

    return results[0];
  }

  public async update(id: number, data: Partial<NewBatchContent>): Promise<BatchContent | null> {
    const results = await db
      .update(batchContent)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(batchContent.id, id))
      .returning();

    return results[0] || null;
  }

  public async delete(id: number): Promise<boolean> {
    const results = await db
      .delete(batchContent)
      .where(eq(batchContent.id, id))
      .returning();

    return results.length > 0;
  }

  public async search(limit: number, offset: number, batchId?: number, sectionId?: number) {
    let query = db
      .select({
        id: batchContent.id,
        batchId: batchContent.batchId,
        contentId: batchContent.contentId,
        sectionId: batchContent.sectionId,
        order: batchContent.order,
        accessOn: batchContent.accessOn,
        accessTill: batchContent.accessTill,
        accessOnDate: batchContent.accessOnDate,
        accessTillDate: batchContent.accessTillDate,
        metadata: batchContent.metadata,
        createdAt: batchContent.createdAt,
        updatedAt: batchContent.updatedAt,
        batch: {
          name: batches.name,
        },
        section: {
          title: batchSections.title,
        },
        content: {
          title: contentLibrary.title,
          type: contentLibrary.type,
        }
      })
      .from(batchContent)
      .leftJoin(batches, eq(batchContent.batchId, batches.id))
      .leftJoin(batchSections, eq(batchContent.sectionId, batchSections.id))
      .leftJoin(contentLibrary, eq(batchContent.contentId, contentLibrary.id))
      .$dynamic();

    const conditions = [];
    if (batchId !== undefined) {
      conditions.push(eq(batchContent.batchId, batchId));
    }
    if (sectionId !== undefined) {
      conditions.push(eq(batchContent.sectionId, sectionId));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return query
      .orderBy(batchContent.order)
      .limit(limit)
      .offset(offset);
  }

  public async count(batchId?: number, sectionId?: number): Promise<number> {
    let query = db.select({ count: sql<number>`count(*)` }).from(batchContent).$dynamic();

    const conditions = [];
    if (batchId !== undefined) {
      conditions.push(eq(batchContent.batchId, batchId));
    }
    if (sectionId !== undefined) {
      conditions.push(eq(batchContent.sectionId, sectionId));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query;
    return Number(results[0]?.count || 0);
  }

  public async updateOrders(orders: { id: number; order: number }[]): Promise<void> {
    await db.transaction(async (tx) => {
      for (const item of orders) {
        await tx
          .update(batchContent)
          .set({ order: item.order, updatedAt: new Date() })
          .where(eq(batchContent.id, item.id));
      }
    });
  }

  public async createBulk(
    batchId: number,
    sectionId: number,
    items: { contentId: number; accessOn: number; accessTill: number }[]
  ): Promise<BatchContent[]> {
    return db.transaction(async (tx) => {
      // 1. Find current max order for this section
      const maxOrderResult = await tx
        .select({ maxOrder: sql<number>`max(${batchContent.order})` })
        .from(batchContent)
        .where(eq(batchContent.sectionId, sectionId));

      let currentMax = maxOrderResult[0]?.maxOrder ?? 0;
      const inserted: BatchContent[] = [];

      // 2. Insert sequentially to preserve order
      for (const item of items) {
        currentMax += 1;
        const results = await tx
          .insert(batchContent)
          .values({
            batchId,
            sectionId,
            contentId: item.contentId,
            accessOn: item.accessOn,
            accessTill: item.accessTill,
            order: currentMax,
          })
          .returning();
        inserted.push(results[0]);
      }

      return inserted;
    });
  }
}
