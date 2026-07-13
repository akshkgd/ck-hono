import { pgTable, uuid, varchar, text, smallint, boolean, integer, jsonb, timestamp, pgEnum, bigserial, bigint, date, index, uniqueIndex } from 'drizzle-orm/pg-core';

export const occupationTypeEnum = pgEnum('occupation_type', ['student', 'professional', 'academic', 'other']);
export const roleEnum = pgEnum('role', ['student', 'admin', 'user', 'moderator']);
export const statusEnum = pgEnum('status', ['active', 'inactive', 'suspended']);

export const batchTypeEnum = pgEnum('batch_type', ['cohort', 'live', 'webinar', 'callBooking', 'mentorship']);
export const batchStatusEnum = pgEnum('batch_status', ['active', 'private', 'completed']);

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
  lastActiveAt: timestamp('last_active_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('users_name_idx').on(table.name),
  index('users_mobile_idx').on(table.mobile),
  index('users_created_at_idx').on(table.createdAt),
  index('users_name_trgm_idx').using('gin', table.name.op('gin_trgm_ops')),
  index('users_email_trgm_idx').using('gin', table.email.op('gin_trgm_ops')),
]);

export const batches = pgTable('batches', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  topic: varchar('topic', { length: 255 }),
  name: varchar('name', { length: 255 }).notNull(),
  description: varchar('description', { length: 255 }),
  slug: varchar('slug', { length: 255 }),
  price: integer('price'),
  certificateFee: integer('certificate_fee').default(0).notNull(),
  limit: integer('limit').default(0),
  img: varchar('img', { length: 255 }),
  association: varchar('association', { length: 255 }),
  logo: varchar('logo', { length: 255 }),
  type: batchTypeEnum('type').default('cohort').notNull(),
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  whatsAppLink: varchar('whatsapp_link', { length: 255 }),
  telegramLink: varchar('telegram_link', { length: 255 }),
  telegramBroadcast: varchar('telegram_broadcast', { length: 255 }),
  teacherId: uuid('teacher_id').references(() => users.id, { onDelete: 'set null' }),
  teacherPayment: boolean('teacher_payment').default(false).notNull(),
  meetingLink: varchar('meeting_link', { length: 255 }),
  nextClassTopic: varchar('next_class_topic', { length: 255 }),
  desc: varchar('desc', { length: 255 }),
  nextClass: timestamp('next_class'),
  status: batchStatusEnum('status').default('private').notNull(),
  metadata: jsonb('metadata').default({}),
  accessTillDate: date('access_till_date'),
  accessTillYear: integer('access_till_year').default(1),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => [
  index('batches_slug_idx').on(table.slug),
]);

export const enrollmentTypeEnum = pgEnum('enrollment_type', ['oneTime', 'Subscription', 'free']);
export const paymentStatusEnum = pgEnum('payment_status', ['captured', 'failed', 'created', 'refunded']);
export const subscriptionStatusEnum = pgEnum('subscription_status', ['active', 'expired', 'pending']);

export const batchEnrollments = pgTable('batch_enrollments', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  batchId: bigint('batch_id', { mode: 'number' }).references(() => batches.id, { onDelete: 'cascade' }).notNull(),
  amountPayable: integer('amount_payable'),
  enrollmentType: enrollmentTypeEnum('enrollment_type').default('oneTime').notNull(),
  status: smallint('status').default(0).notNull(), // Active, Inactive, Cancelled, Suspended default inactive (0)
  progress: integer('progress').default(0).notNull(),
  timeSpentSeconds: integer('time_spent_seconds').default(0).notNull(),
  amountPaid: integer('amount_paid').default(0).notNull(),
  certificateFee: integer('certificate_fee'),
  paymentStatus: paymentStatusEnum('payment_status').default('created').notNull(),
  paymentMethod: varchar('payment_method', { length: 50 }),
  couponCode: varchar('coupon_code', { length: 100 }),
  transactionId: varchar('transaction_id', { length: 255 }),
  invoiceId: varchar('invoice_id', { length: 255 }),
  subscriptionId: varchar('subscription_id', { length: 255 }),
  subscriptionStatus: subscriptionStatusEnum('subscription_status'),
  subscriptionActiveOn: date('subscription_active_on'),
  subscriptionExpiresOn: date('subscription_expires_on'),
  paidAt: timestamp('paid_at'),
  certificateId: varchar('certificate_id', { length: 255 }).unique(),
  certificateGeneratedAt: timestamp('certificate_generated_at'),
  startedAt: timestamp('started_at'),
  accessTill: date('access_till'),
  overrideAccessDays: integer('override_access_days'),
  utmSource: varchar('utm_source', { length: 100 }),
  utmMedium: varchar('utm_medium', { length: 100 }),
  utmCampaign: varchar('utm_campaign', { length: 150 }),
  remark: text('remark'),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('enrollments_user_id_idx').on(table.userId),
  index('enrollments_batch_id_idx').on(table.batchId),
  index('enrollments_payment_status_idx').on(table.paymentStatus),
  index('enrollments_created_at_idx').on(table.createdAt),
]);

export const batchEnrollmentPayments = pgTable('batch_enrollment_payments', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  batchEnrollmentId: bigint('batch_enrollment_id', { mode: 'number' }).references(() => batchEnrollments.id, { onDelete: 'cascade' }).notNull(),
  amount: integer('amount').notNull(),
  paidAt: timestamp('paid_at').notNull(),
  paymentMethod: varchar('payment_method', { length: 100 }),
  transactionId: varchar('transaction_id', { length: 255 }).unique(),
  invoiceId: varchar('invoice_id', { length: 255 }).unique(),
  purpose: varchar('purpose', { length: 50 }).default('enrollment').notNull(),
  isGstApplicable: boolean('is_gst_applicable').default(true).notNull(),
  remarks: text('remarks'),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('batch_payments_paid_at_idx').on(table.paidAt),
  index('batch_payments_batch_enrollment_id_idx').on(table.batchEnrollmentId),
]);

export const batchSections = pgTable('batch_sections', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  batchId: bigint('batch_id', { mode: 'number' }).references(() => batches.id, { onDelete: 'cascade' }),
  order: integer('order'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('batch_sections_batch_id_idx').on(table.batchId),
]);

export const contentLibraryTypeEnum = pgEnum('content_library_type', ['video', 'coding lab', 'assignment', 'article']);
export const contentTypeClassEnum = pgEnum('content_type_class', ['primary', 'secondary']);

export const contentLibrary = pgTable('content_library', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  desc: text('desc'),
  type: contentLibraryTypeEnum('type').notNull(),
  contentType: contentTypeClassEnum('content_type').default('primary').notNull(),
  videoLink: varchar('video_link', { length: 255 }),
  videoDuration: integer('video_duration'),
  assignment: text('assignment'),
  xp: integer('xp'),
  solutionCode: text('solution_code'),
  hints: jsonb('hints'),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('content_library_type_idx').on(table.type),
  index('content_library_content_type_idx').on(table.contentType),
  index('content_library_title_idx').on(table.title),
]);

export const batchContent = pgTable('batch_content', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  batchId: bigint('batch_id', { mode: 'number' }).references(() => batches.id, { onDelete: 'cascade' }).notNull(),
  contentId: bigint('content_id', { mode: 'number' }).references(() => contentLibrary.id, { onDelete: 'cascade' }).notNull(),
  sectionId: bigint('section_id', { mode: 'number' }).references(() => batchSections.id, { onDelete: 'cascade' }).notNull(),
  order: integer('order'),
  accessOn: integer('access_on').default(0).notNull(),
  accessTill: integer('access_till').default(0).notNull(),
  accessOnDate: date('access_on_date'),
  accessTillDate: date('access_till_date'),
  canSubmitAssignment: boolean('can_submit_assignment'),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('batch_content_batch_id_idx').on(table.batchId),
  index('batch_content_content_id_idx').on(table.contentId),
  index('batch_content_section_id_idx').on(table.sectionId),
]);

export const userStatusEnum = pgEnum('user_status', ['not_started', 'learning', 'completed']);
export const assignmentStatusEnum = pgEnum('assignment_status', ['Submitted', 'under review', 'approved', 'rejected']);
export const codeSubmittedStatusEnum = pgEnum('code_submitted_status', ['Accepted', 'rejected', 'attempted']);

export const courseProgress = pgTable('course_progress', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  enrollmentId: bigint('enrollment_id', { mode: 'number' }).references(() => batchEnrollments.id, { onDelete: 'cascade' }).notNull(),
  batchContentId: bigint('batch_content_id', { mode: 'number' }).references(() => batchContent.id, { onDelete: 'cascade' }).notNull(),
  timeSpent: integer('time_spent').default(0).notNull(),
  progress: integer('progress').default(0).notNull(),
  status: userStatusEnum('status').default('not_started').notNull(),
  githubLink: varchar('github_link', { length: 255 }),
  deployedLink: varchar('deployed_link', { length: 255 }),
  assignmentStatus: assignmentStatusEnum('assignment_status'),
  userRemark: text('user_remark'),
  teacherRemark: text('teacher_remark'),
  videoFeedback: text('video_feedback'),
  codeSubmitted: text('code_submitted'),
  codeSubmittedStatus: codeSubmittedStatusEnum('code_submitted_status'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index('course_progress_batch_content_id_idx').on(table.batchContentId),
  uniqueIndex('course_progress_enrollment_content_uniq_idx').on(table.enrollmentId, table.batchContentId),
  index('course_progress_user_id_idx').on(table.userId),
  index('course_progress_assignment_status_updated_at_idx').on(table.assignmentStatus, table.updatedAt),
]);




