import { db } from '../../db/index.js';
import { magicLinkTokens, userSessions, users } from '../../db/schema.js';
import { eq, and, gt } from 'drizzle-orm';

export interface CreateMagicLinkTokenInput {
  email: string;
  tokenHash: string;
  expiresAt: Date;
}

export interface CreateSessionInput {
  userId: string;
  sessionTokenHash: string;
  ipAddress?: string;
  userAgent?: string;
  expiresAt: Date;
}

export class SessionRepository {
  /**
   * Insert new SHA-256 hashed magic link token
   */
  async createMagicLinkToken(input: CreateMagicLinkTokenInput) {
    const [tokenRecord] = await db.insert(magicLinkTokens)
      .values({
        email: input.email.toLowerCase().trim(),
        tokenHash: input.tokenHash,
        expiresAt: input.expiresAt,
        used: false,
      })
      .returning();
    return tokenRecord;
  }

  /**
   * Find unexpired & unused magic link token by SHA-256 hash
   */
  async findValidMagicLinkToken(tokenHash: string) {
    const [record] = await db.select()
      .from(magicLinkTokens)
      .where(
        and(
          eq(magicLinkTokens.tokenHash, tokenHash),
          eq(magicLinkTokens.used, false),
          gt(magicLinkTokens.expiresAt, new Date())
        )
      )
      .limit(1);
    return record || null;
  }

  /**
   * Mark magic link token as used
   */
  async markMagicLinkTokenUsed(tokenId: string) {
    await db.update(magicLinkTokens)
      .set({ used: true })
      .where(eq(magicLinkTokens.id, tokenId));
  }

  /**
   * Create 30-day user session
   */
  async createSession(input: CreateSessionInput) {
    const [sessionRecord] = await db.insert(userSessions)
      .values({
        userId: input.userId,
        sessionTokenHash: input.sessionTokenHash,
        ipAddress: input.ipAddress || null,
        userAgent: input.userAgent || null,
        expiresAt: input.expiresAt,
        revoked: false,
      })
      .returning();
    return sessionRecord;
  }

  /**
   * Find valid (unrevoked & unexpired) user session with user details
   */
  async findValidSessionWithUser(sessionTokenHash: string) {
    const records = await db.select({
      session: userSessions,
      user: users,
    })
      .from(userSessions)
      .innerJoin(users, eq(userSessions.userId, users.id))
      .where(
        and(
          eq(userSessions.sessionTokenHash, sessionTokenHash),
          eq(userSessions.revoked, false),
          gt(userSessions.expiresAt, new Date())
        )
      )
      .limit(1);

    if (records.length === 0) return null;
    return records[0];
  }

  /**
   * Touch session last_active_at timestamp
   */
  async touchSession(sessionId: string) {
    await db.update(userSessions)
      .set({ lastActiveAt: new Date() })
      .where(eq(userSessions.id, sessionId));
  }

  /**
   * Revoke single session (Logout)
   */
  async revokeSession(sessionId: string) {
    await db.update(userSessions)
      .set({ revoked: true })
      .where(eq(userSessions.id, sessionId));
  }

  /**
   * Revoke all sessions for a user (Logout from all devices)
   */
  async revokeAllUserSessions(userId: string) {
    await db.update(userSessions)
      .set({ revoked: true })
      .where(eq(userSessions.userId, userId));
  }
}

export const sessionRepository = new SessionRepository();
