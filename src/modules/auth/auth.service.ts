import argon2 from 'argon2';
import { sign, verify, decode } from 'hono/jwt';
import { UserRepository } from '../users/user.repository.js';
import type { LoginInput, RegisterInput } from './auth.validation.js';
import { redis, isRedisReady } from '../../utils/redis.js';
import { v4 as uuidv4 } from 'uuid';

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  public async createSessionAndToken(user: any, jwtSecret: string, ipAddress?: string, userAgent?: string) {
    const sessionId = uuidv4();
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      sessionId,
      exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days expiration
    };

    const token = await sign(payload, jwtSecret, 'HS256');

    // Store session in Redis
    if (redis && isRedisReady()) {
      try {
        await redis.setex(
          `session:${user.id}:${sessionId}`,
          7 * 24 * 60 * 60, // 7 days
          JSON.stringify({
            ipAddress: ipAddress || 'unknown',
            userAgent: userAgent || 'unknown',
            createdAt: new Date().toISOString(),
          })
        );
      } catch (err) {
        console.error('[Redis] Failed to write session:', err);
      }
    }

    // Omit password from user response
    const { password, ...userWithoutPassword } = user;

    return {
      token,
      user: userWithoutPassword,
    };
  }

  public async login(input: LoginInput, jwtSecret: string, ipAddress?: string, userAgent?: string) {
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await argon2.verify(user.password, input.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    return this.createSessionAndToken(user, jwtSecret, ipAddress, userAgent);
  }

  public async register(input: RegisterInput, jwtSecret: string, ipAddress?: string, userAgent?: string) {
    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    const hashedPassword = await argon2.hash(input.password);

    const newUser = await this.userRepository.create({
      email: input.email,
      password: hashedPassword,
      name: input.name || null,
      mobile: input.mobile || null,
      occupationType: 'other',
      role: 'student',
      status: 'active',
      emailVerified: false,
    });

    return this.createSessionAndToken(newUser, jwtSecret, ipAddress, userAgent);
  }

  public async refreshSession(token: string, jwtSecret: string, ipAddress?: string, userAgent?: string) {
    let payload: any = null;
    try {
      const decoded = decode(token);
      payload = decoded.payload;
    } catch (decodeErr) {
      throw new Error('Invalid token');
    }

    if (!payload || !payload.id || !payload.sessionId) {
      throw new Error('Invalid token payload');
    }

    // Validate session in Redis (if enabled)
    if (redis && isRedisReady()) {
      const sessionKey = `session:${payload.id}:${payload.sessionId}`;
      const sessionExists = await redis.exists(sessionKey);
      if (!sessionExists) {
        throw new Error('Session has expired or been logged out');
      }
      // Clean up old session
      await redis.del(sessionKey);
    } else {
      // Without Redis, check if the token signature is valid and not expired
      try {
        await verify(token, jwtSecret, 'HS256');
      } catch (err: any) {
        throw new Error('Session expired');
      }
    }

    // Find user
    const user = await this.userRepository.findById(payload.id);
    if (!user) {
      throw new Error('User not found');
    }

    // Create new session & token
    return this.createSessionAndToken(user, jwtSecret, ipAddress, userAgent);
  }
}
