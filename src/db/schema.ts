import { pgTable, uuid, varchar, text, smallint, boolean, integer, jsonb, timestamp, pgEnum } from 'drizzle-orm/pg-core';

export const occupationTypeEnum = pgEnum('occupation_type', ['student', 'professional', 'academic', 'other']);
export const roleEnum = pgEnum('role', ['student', 'admin', 'user', 'moderator']);
export const statusEnum = pgEnum('status', ['active', 'inactive', 'suspended']);

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }),
  mobile: varchar('mobile', { length: 20 }),
  avatarUrl: text('avatar_url'),
  bio: text('bio'),
  linkedinUrl: text('linkedin_url'),
  githubUrl: text('github_url'),
  occupationType: occupationTypeEnum('occupation_type').default('other').notNull(),
  occupationTitle: varchar('occupation_title', { length: 100 }),
  organization: varchar('organization', { length: 150 }),
  experienceYears: smallint('experience_years'),
  role: roleEnum('role').default('student').notNull(),
  status: statusEnum('status').default('active').notNull(),
  googleId: varchar('google_id', { length: 255 }),
  emailVerified: boolean('email_verified').default(false).notNull(),
  xp: integer('xp').default(0).notNull(),
  currentStreak: integer('current_streak').default(0).notNull(),
  longestStreak: integer('longest_streak').default(0).notNull(),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
