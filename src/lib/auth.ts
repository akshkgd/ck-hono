import { betterAuth } from 'better-auth';
import { emailOTP } from 'better-auth/plugins';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import * as schema from '../db/schema.js';
import { queueGenericEmail } from '../queues/index.js';
import { randomUUID } from 'node:crypto';

const isProd = process.env.NODE_ENV === 'production';
const defaultFrontendUrl = isProd ? 'https://app.codekaro.in' : 'http://localhost:5173';
const activeFrontendUrl = process.env.FRONTEND_URL || defaultFrontendUrl;

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET || process.env.JWT_SECRET || 'codekaro-default-auth-secret-key-32chars',
  baseURL: process.env.BETTER_AUTH_URL || activeFrontendUrl,
  basePath: '/api/auth',
  trustedOrigins: [
    activeFrontendUrl,
    'https://codekaro.in',
    'https://app.codekaro.in',
    'http://app.codekaro.in',
    'https://live.codekaro.in',
    'http://live.codekaro.in',
    'http://localhost:3000',
    'http://localhost:5173',
  ],
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: schema,
  }),
  advanced: {
    database: {
      generateId: 'uuid',
    },
    ipAddress: {
      ipAddressHeaders: ['x-forwarded-for', 'cf-connecting-ip', 'x-real-ip'],
    },
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'student',
      },
      avatarUrl: {
        type: 'string',
        required: false,
      },
      mobile: {
        type: 'string',
        required: false,
      },
      xp: {
        type: 'number',
        defaultValue: 0,
      },
      currentStreak: {
        type: 'number',
        defaultValue: 0,
      },
      longestStreak: {
        type: 'number',
        defaultValue: 0,
      },
      lastActiveAt: {
        type: 'date',
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  rateLimit: {
    window: 60, // 60 Seconds window
    max: 10, // Max 10 requests per minute per IP
    storage: 'memory', // Fast in-memory rate limiting without DB overhead
  },

  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 Days in seconds (2,592,000s)
    updateAge: 60 * 60 * 24, // Update session activity daily
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 30,
    },
  },
  plugins: [
    emailOTP({
      otpLength: 4,
      rateLimit: {
        window: 60,
        max: 20, // Increased max requests to 20 per minute (default is 3)
      },
      async sendVerificationOTP({ email, otp, type }: { email: string; otp: string; type: string }) {
        try {
          // Look up user name
          const userRecord = await db
            .select({ name: schema.users.name })
            .from(schema.users)
            .where(eq(schema.users.email, email))
            .limit(1)
            .then(res => res[0]);

          let studentName = '';
          if (userRecord && userRecord.name) {
            // Get only the first name
            studentName = userRecord.name.trim().split(/\s+/)[0];
          } else {
            // Fallback: Split email prefix and capitalize first letter
            const prefix = email.split('@')[0];
            studentName = prefix.charAt(0).toUpperCase() + prefix.slice(1);
          }

          await queueGenericEmail(email, {
            title: `${otp} is your Codekaro Verification Code`,
            message: `Your one-time login code is: ${otp}\n\nValid for 10 minutes. Do not share this code with anyone for security.`,
            greeting: `Hello ${studentName},`,
            actionText: 'Sign In to Codekaro',
            actionUrl: `${activeFrontendUrl}/login`,
          });
        } catch (err: any) {
          console.error('[EmailOTP] Failed to dispatch OTP email:', err);
        }
      },
    }),
  ],
});
