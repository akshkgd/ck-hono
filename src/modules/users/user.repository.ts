import { db } from '../../db/index.js';
import { users } from '../../db/schema.js';
import { eq, or, ilike, and, asc, desc, sql } from 'drizzle-orm';

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export class UserRepository {
  public async findByEmail(email: string): Promise<User | null> {
    const results = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    
    return results[0] || null;
  }

  public async findById(id: string): Promise<User | null> {
    const results = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    
    return results[0] || null;
  }

  public async create(userData: NewUser): Promise<User> {
    const results = await db
      .insert(users)
      .values(userData)
      .returning();
    
    return results[0];
  }

  public async createMany(usersData: NewUser[]): Promise<User[]> {
    return db
      .insert(users)
      .values(usersData)
      .returning();
  }

  public async update(id: string, data: Partial<NewUser>): Promise<User | null> {
    const results = await db
      .update(users)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();
    
    return results[0] || null;
  }

  public async delete(id: string): Promise<boolean> {
    const results = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning();
    
    return results.length > 0;
  }

  public async search(
    queryText: string,
    limit: number,
    offset: number,
    role?: 'student' | 'admin' | 'user' | 'moderator',
    sortBy: 'createdAt' | 'name' | 'email' | 'xp' | 'lastActiveAt' = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc'
  ): Promise<User[]> {
    const conditions = [];

    if (queryText) {
      const searchPattern = `%${queryText}%`;
      conditions.push(
        or(
          ilike(users.name, searchPattern),
          ilike(users.email, searchPattern),
          ilike(users.mobile, searchPattern)
        )
      );
    }

    if (role) {
      conditions.push(eq(users.role, role));
    }

    let orderColumn;
    switch (sortBy) {
      case 'name':
        orderColumn = users.name;
        break;
      case 'email':
        orderColumn = users.email;
        break;
      case 'xp':
        orderColumn = users.xp;
        break;
      case 'lastActiveAt':
        orderColumn = users.lastActiveAt;
        break;
      case 'createdAt':
      default:
        orderColumn = users.createdAt;
        break;
    }

    const sortFn = sortOrder === 'asc' ? asc : desc;
    const orderByClause = orderColumn ? sortFn(orderColumn) : desc(users.createdAt);

    const query = db
      .select()
      .from(users);

    if (conditions.length > 0) {
      query.where(and(...conditions));
    }

    return query
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset);
  }

  public async count(q?: string, role?: 'student' | 'admin' | 'user' | 'moderator'): Promise<number> {
    const query = db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .$dynamic();

    const conditions = [];
    if (q) {
      const searchPattern = `%${q}%`;
      conditions.push(
        or(
          ilike(users.name, searchPattern),
          ilike(users.email, searchPattern),
          ilike(users.mobile, searchPattern)
        )
      );
    }
    if (role) {
      conditions.push(eq(users.role, role));
    }

    if (conditions.length > 0) {
      query.where(and(...conditions));
    }

    const results = await query;
    return Number(results[0]?.count || 0);
  }
}
