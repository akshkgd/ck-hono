import crypto from 'crypto';
import argon2 from 'argon2';
import { UserRepository } from '../users/user.repository.js';
import { sessionRepository } from './session.repository.js';
import { queueGenericEmail } from '../../queues/index.js';
import { generateMagicLinkEmail } from '../../utils/email-templates.js';
import { redis, isRedisReady } from '../../utils/redis.js';
import type { RequestMagicLinkInput, VerifyMagicLinkInput } from './auth.validation.js';

export const SESSION_DURATION_SECONDS = 30 * 24 * 60 * 60; // 30 Days in seconds (2,592,000s)
export const MAGIC_LINK_EXPIRATION_MINUTES = 15;

function hashToken(rawToken: string): string {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
}

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  /**
   * Helper to issue a 30-day session for a user (e.g. after payment or magic link verification)
   */
  public async create30DaySession(user: any, ipAddress?: string, userAgent?: string) {
    const rawSessionToken = crypto.randomBytes(32).toString('hex');
    const sessionTokenHash = hashToken(rawSessionToken);
    const expiresAt = new Date(Date.now() + SESSION_DURATION_SECONDS * 1000);

    const sessionRecord = await sessionRepository.createSession({
      userId: user.id,
      sessionTokenHash,
      ipAddress,
      userAgent,
      expiresAt,
    });

    const { password, ...userWithoutPassword } = user;

    if (redis && isRedisReady()) {
      try {
        await redis.setex(
          `session:${sessionTokenHash}`,
          SESSION_DURATION_SECONDS,
          JSON.stringify({
            sessionId: sessionRecord.id,
            userId: user.id,
            user: userWithoutPassword,
            expiresAt: expiresAt.toISOString(),
          })
        );
      } catch (redisErr) {
        console.error('[Redis] Failed to cache 30-day session:', redisErr);
      }
    }

    return {
      sessionToken: rawSessionToken,
      token: rawSessionToken,
      expiresAt,
      maxAge: SESSION_DURATION_SECONDS,
      user: userWithoutPassword,
    };
  }

  /**
   * Request a passwordless Magic Link
   */
  public async requestMagicLink(input: RequestMagicLinkInput) {
    const cleanEmail = input.email.toLowerCase().trim();
    let user = await this.userRepository.findByEmail(cleanEmail);

    if (!user) {
      // Auto-register new user if email does not exist
      const randomPassword = crypto.randomBytes(16).toString('hex');
      const hashedPassword = await argon2.hash(randomPassword);
      user = await this.userRepository.create({
        email: cleanEmail,
        password: hashedPassword,
        name: input.name || cleanEmail.split('@')[0],
        role: 'student',
        status: 'active',
        emailVerified: false,
      });
    }

    // Generate cryptographically secure random token (256-bit)
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + MAGIC_LINK_EXPIRATION_MINUTES * 60 * 1000);

    // Save hashed token in DB
    await sessionRepository.createMagicLinkToken({
      email: cleanEmail,
      tokenHash,
      expiresAt,
    });

    // Construct Magic Link URL
    const frontendUrl = process.env.FRONTEND_URL || 'https://codekaro.in';
    const magicLinkUrl = `${frontendUrl}/auth/magic-link/callback?token=${rawToken}`;

    // Generate HTML email template
    const studentName = user.name || cleanEmail.split('@')[0];
    const emailTemplate = generateMagicLinkEmail({
      studentName,
      magicLinkUrl,
      expiresInMinutes: MAGIC_LINK_EXPIRATION_MINUTES,
    });

    // Dispatch Magic Link via Email Queue
    await queueGenericEmail(cleanEmail, {
      title: emailTemplate.subject,
      message: emailTemplate.text,
      actionText: 'Sign In to Codekaro',
      actionUrl: magicLinkUrl,
    });

    return {
      success: true,
      message: `Magic link sent to ${cleanEmail}. Check your inbox!`,
      expiresInMinutes: MAGIC_LINK_EXPIRATION_MINUTES,
    };
  }

  /**
   * Verify Magic Link Token and Issue 30-Day Session
   */
  public async verifyMagicLink(input: VerifyMagicLinkInput, ipAddress?: string, userAgent?: string) {
    const rawToken = input.token.trim();
    const tokenHash = hashToken(rawToken);

    // Find and validate token in DB
    const validTokenRecord = await sessionRepository.findValidMagicLinkToken(tokenHash);
    if (!validTokenRecord) {
      throw new Error('Invalid, expired, or already used magic link');
    }

    // Consume token (one-time use)
    await sessionRepository.markMagicLinkTokenUsed(validTokenRecord.id);

    // Find user
    const user = await this.userRepository.findByEmail(validTokenRecord.email);
    if (!user) {
      throw new Error('User account not found');
    }

    // Update email verified status if needed
    if (!user.emailVerified) {
      await this.userRepository.update(user.id, { emailVerified: true });
    }

    return this.create30DaySession(user, ipAddress, userAgent);
  }

  /**
   * Logout single session
   */
  async logout(rawSessionToken: string) {
    if (!rawSessionToken) return;
    const sessionTokenHash = hashToken(rawSessionToken);

    // Remove from Redis fast cache
    if (redis && isRedisReady()) {
      try {
        await redis.del(`session:${sessionTokenHash}`);
      } catch (err) {
        console.error('[Redis] Failed to delete session cache:', err);
      }
    }

    // Revoke in DB
    const sessionRecord = await sessionRepository.findValidSessionWithUser(sessionTokenHash);
    if (sessionRecord) {
      await sessionRepository.revokeSession(sessionRecord.session.id);
    }
  }

  /**
   * Logout from all devices
   */
  async logoutAllDevices(userId: string) {
    await sessionRepository.revokeAllUserSessions(userId);
  }
}

export const authService = new AuthService();
