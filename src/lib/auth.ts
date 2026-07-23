import { betterAuth } from 'better-auth';
import { emailOTP } from 'better-auth/plugins';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
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
  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'student',
        fieldName: 'role',
      },
      avatarUrl: {
        type: 'string',
        required: false,
        fieldName: 'avatar_url',
      },
      mobile: {
        type: 'string',
        required: false,
        fieldName: 'mobile',
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
  advanced: {
    generateId: () => randomUUID(),
    ipAddress: {
      ipAddressHeaders: ['x-forwarded-for'],
    },
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
      rateLimit: {
        window: 60,
        max: 20, // Increased max requests to 20 per minute (default is 3)
      },
      async sendVerificationOTP({ email, otp, type }: { email: string; otp: string; type: string }) {
        try {
          const studentName = email.split('@')[0];
          await queueGenericEmail(email, {
            title: `${otp} is your Codekaro Verification Code`,
            message: `Hello ${studentName},\n\nYour one-time login code is: ${otp}\n\nValid for 10 minutes. Do not share this code with anyone for security.`,
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
