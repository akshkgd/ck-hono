import { db } from '../../db/index.js';
import { users } from '../../db/schema.js';
import { eq, or, ilike } from 'drizzle-orm';

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

  public async search(queryText: string, limit: number, offset: number): Promise<User[]> {
    const searchPattern = `%${queryText}%`;
    return db
      .select()
      .from(users)
      .where(
        or(
          ilike(users.name, searchPattern),
          ilike(users.email, searchPattern)
        )
      )
      .limit(limit)
      .offset(offset);
  }
}
