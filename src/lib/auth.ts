import { betterAuth } from 'better-auth';
import { magicLink } from 'better-auth/plugins';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '../db/index.js';
import * as schema from '../db/schema.js';
import { queueGenericEmail } from '../queues/index.js';
import { generateMagicLinkEmail } from '../utils/email-templates.js';

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET || process.env.JWT_SECRET || 'codekaro-default-auth-secret-key-32chars',
  baseURL: process.env.BETTER_AUTH_URL || process.env.FRONTEND_URL || 'https://app.codekaro.in',
  basePath: '/api/auth',
  trustedOrigins: [
    process.env.FRONTEND_URL || 'https://app.codekaro.in',
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
  emailAndPassword: {
    enabled: true,
  },
  rateLimit: {
    window: 60, // 60 Seconds window
    max: 10, // Max 10 requests per minute per IP
    storage: 'memory', // Fast in-memory rate limiting without DB overhead
  },
  advanced: {
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
    magicLink({
      sendMagicLink: async ({ email, url }: { email: string; url: string; token: string }) => {
        try {
          // Force target domain to app.codekaro.in for both main link and callbackURL parameter
          let targetUrl = url;
          const targetDomain = process.env.FRONTEND_URL || 'https://app.codekaro.in';

          try {
            const parsedUrl = new URL(url);
            const targetParsed = new URL(targetDomain);

            // 1. Rewrite primary domain (e.g. codekaro.in -> app.codekaro.in)
            parsedUrl.protocol = targetParsed.protocol;
            parsedUrl.host = targetParsed.host;

            // 2. Rewrite callbackURL query parameter if present (e.g. localhost:5173 -> app.codekaro.in)
            const callbackParam = parsedUrl.searchParams.get('callbackURL');
            if (callbackParam) {
              try {
                const parsedCallback = new URL(callbackParam);
                parsedCallback.protocol = targetParsed.protocol;
                parsedCallback.host = targetParsed.host;
                parsedUrl.searchParams.set('callbackURL', parsedCallback.toString());
              } catch {
                parsedUrl.searchParams.set('callbackURL', `${targetDomain}/verify-magic-link`);
              }
            } else {
              parsedUrl.searchParams.set('callbackURL', `${targetDomain}/verify-magic-link`);
            }

            targetUrl = parsedUrl.toString();
          } catch {
            targetUrl = url;
          }

          const studentName = email.split('@')[0];
          const emailTemplate = generateMagicLinkEmail({
            studentName,
            magicLinkUrl: targetUrl,
            expiresInMinutes: 15,
          });

          await queueGenericEmail(email, {
            title: emailTemplate.subject,
            message: emailTemplate.text,
            actionText: 'Sign In to Codekaro',
            actionUrl: targetUrl,
          });
        } catch (err: any) {
          console.error('[MagicLink] Failed to dispatch magic link email:', err);
        }
      },
    }),
  ],
});
