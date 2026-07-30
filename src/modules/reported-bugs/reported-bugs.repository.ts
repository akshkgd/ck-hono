import { db } from '../../db/index.js';
import { reportedBugs, users } from '../../db/schema.js';
import { eq, or, ilike, and, desc, asc, sql } from 'drizzle-orm';

export class ReportedBugsRepository {
  public async create(userId: string, data: {
    title: string;
    description: string;
    url?: string | null;
    severity?: 'low' | 'medium' | 'high' | 'critical';
    deviceInfo?: any;
    screenshotUrl?: string | null;
  }) {
    const [result] = await db
      .insert(reportedBugs)
      .values({
        userId,
        title: data.title,
        description: data.description,
        url: data.url || null,
        severity: data.severity || 'medium',
        status: 'pending',
        deviceInfo: data.deviceInfo || {},
        screenshotUrl: data.screenshotUrl || null,
      })
      .returning();
    return result;
  }

  public async findById(id: string) {
    const results = await db
      .select({
        id: reportedBugs.id,
        userId: reportedBugs.userId,
        title: reportedBugs.title,
        description: reportedBugs.description,
        url: reportedBugs.url,
        severity: reportedBugs.severity,
        status: reportedBugs.status,
        deviceInfo: reportedBugs.deviceInfo,
        screenshotUrl: reportedBugs.screenshotUrl,
        remarks: reportedBugs.remarks,
        createdAt: reportedBugs.createdAt,
        updatedAt: reportedBugs.updatedAt,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
      })
      .from(reportedBugs)
      .leftJoin(users, eq(reportedBugs.userId, users.id))
      .where(eq(reportedBugs.id, id))
      .limit(1);

    return results[0] || null;
  }

  public async search(
    q?: string,
    limit: number = 20,
    offset: number = 0,
    sortOrder: 'asc' | 'desc' = 'desc',
    status?: 'pending' | 'investigating' | 'resolved' | 'closed',
    severity?: 'low' | 'medium' | 'high' | 'critical'
  ) {
    let query = db
      .select({
        id: reportedBugs.id,
        userId: reportedBugs.userId,
        title: reportedBugs.title,
        description: reportedBugs.description,
        url: reportedBugs.url,
        severity: reportedBugs.severity,
        status: reportedBugs.status,
        deviceInfo: reportedBugs.deviceInfo,
        screenshotUrl: reportedBugs.screenshotUrl,
        remarks: reportedBugs.remarks,
        createdAt: reportedBugs.createdAt,
        updatedAt: reportedBugs.updatedAt,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
      })
      .from(reportedBugs)
      .leftJoin(users, eq(reportedBugs.userId, users.id));

    const conditions = [];

    if (q) {
      const pattern = `%${q}%`;
      conditions.push(
        or(
          ilike(reportedBugs.title, pattern),
          ilike(reportedBugs.description, pattern),
          ilike(users.name, pattern),
          ilike(users.email, pattern)
        )
      );
    }

    if (status) {
      conditions.push(eq(reportedBugs.status, status));
    }

    if (severity) {
      conditions.push(eq(reportedBugs.severity, severity));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    const orderFn = sortOrder === 'asc' ? asc : desc;
    query = query.orderBy(orderFn(reportedBugs.createdAt)).limit(limit).offset(offset) as any;

    return query;
  }

  public async count(
    q?: string,
    status?: 'pending' | 'investigating' | 'resolved' | 'closed',
    severity?: 'low' | 'medium' | 'high' | 'critical'
  ) {
    let query = db
      .select({ count: sql<number>`count(*)` })
      .from(reportedBugs)
      .leftJoin(users, eq(reportedBugs.userId, users.id));

    const conditions = [];

    if (q) {
      const pattern = `%${q}%`;
      conditions.push(
        or(
          ilike(reportedBugs.title, pattern),
          ilike(reportedBugs.description, pattern),
          ilike(users.name, pattern),
          ilike(users.email, pattern)
        )
      );
    }

    if (status) {
      conditions.push(eq(reportedBugs.status, status));
    }

    if (severity) {
      conditions.push(eq(reportedBugs.severity, severity));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    const results = await query;
    return Number(results[0]?.count || 0);
  }

  public async update(id: string, data: {
    status?: 'pending' | 'investigating' | 'resolved' | 'closed';
    severity?: 'low' | 'medium' | 'high' | 'critical';
    remarks?: string | null;
  }) {
    const [result] = await db
      .update(reportedBugs)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(reportedBugs.id, id))
      .returning();
    return result;
  }

  public async delete(id: string) {
    const [result] = await db
      .delete(reportedBugs)
      .where(eq(reportedBugs.id, id))
      .returning();
    return result;
  }
}
