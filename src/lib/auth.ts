import { betterAuth } from 'better-auth';
import { magicLink } from 'better-auth/plugins';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '../db/index.js';
import * as schema from '../db/schema.js';
import { queueGenericEmail } from '../queues/index.js';
import { generateMagicLinkEmail } from '../utils/email-templates.js';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: schema,
  }),
  emailAndPassword: {
    enabled: true,
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
        const studentName = email.split('@')[0];
        const emailTemplate = generateMagicLinkEmail({
          studentName,
          magicLinkUrl: url,
          expiresInMinutes: 15,
        });

        await queueGenericEmail(email, {
          title: emailTemplate.subject,
          message: emailTemplate.text,
          actionText: 'Sign In to Codekaro',
          actionUrl: url,
        });
      },
    }),
  ],
});
