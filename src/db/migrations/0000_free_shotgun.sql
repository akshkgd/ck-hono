CREATE TYPE "public"."assignment_status" AS ENUM('pending', 'submitted', 'under review', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."batch_status" AS ENUM('active', 'private', 'completed');--> statement-breakpoint
CREATE TYPE "public"."batch_type" AS ENUM('cohort', 'live', 'webinar', 'callBooking', 'mentorship', 'recorded');--> statement-breakpoint
CREATE TYPE "public"."bug_severity" AS ENUM('low', 'medium', 'high', 'critical');--> statement-breakpoint
CREATE TYPE "public"."bug_status" AS ENUM('pending', 'investigating', 'resolved', 'closed');--> statement-breakpoint
CREATE TYPE "public"."code_submitted_status" AS ENUM('Accepted', 'rejected', 'attempted');--> statement-breakpoint
CREATE TYPE "public"."content_library_type" AS ENUM('video', 'coding lab', 'assignment', 'article');--> statement-breakpoint
CREATE TYPE "public"."content_type_class" AS ENUM('primary', 'secondary');--> statement-breakpoint
CREATE TYPE "public"."enrollment_type" AS ENUM('oneTime', 'Subscription', 'free');--> statement-breakpoint
CREATE TYPE "public"."job_status" AS ENUM('pending', 'processing', 'completed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."occupation_type" AS ENUM('student', 'professional', 'academic', 'other');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('captured', 'failed', 'created', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('student', 'admin', 'user', 'moderator', 'teacher');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('active', 'inactive', 'suspended');--> statement-breakpoint
CREATE TYPE "public"."subscription_status" AS ENUM('active', 'expired', 'pending');--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('not_started', 'learning', 'completed');--> statement-breakpoint
CREATE TABLE "account" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "batch_content" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"batch_id" uuid NOT NULL,
	"content_id" uuid NOT NULL,
	"section_id" uuid NOT NULL,
	"order" integer,
	"access_on" integer DEFAULT 0 NOT NULL,
	"access_till" integer DEFAULT 0 NOT NULL,
	"access_on_date" date,
	"access_till_date" date,
	"can_submit_assignment" boolean,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "batch_enrollment_payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"batch_enrollment_id" uuid NOT NULL,
	"amount" integer NOT NULL,
	"paid_at" timestamp NOT NULL,
	"payment_method" varchar(100),
	"transaction_id" varchar(255),
	"invoice_id" varchar(255),
	"purpose" varchar(50) DEFAULT 'enrollment' NOT NULL,
	"is_gst_applicable" boolean DEFAULT true NOT NULL,
	"remarks" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "batch_enrollment_payments_transaction_id_unique" UNIQUE("transaction_id")
);
--> statement-breakpoint
CREATE TABLE "batch_enrollments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"batch_id" uuid NOT NULL,
	"amount_payable" integer,
	"enrollment_type" "enrollment_type" DEFAULT 'oneTime' NOT NULL,
	"status" smallint DEFAULT 0 NOT NULL,
	"progress" integer DEFAULT 0 NOT NULL,
	"time_spent_seconds" integer DEFAULT 0 NOT NULL,
	"amount_paid" integer DEFAULT 0 NOT NULL,
	"certificate_fee" integer,
	"payment_status" "payment_status" DEFAULT 'created' NOT NULL,
	"payment_method" varchar(50),
	"coupon_code" varchar(100),
	"transaction_id" varchar(255),
	"invoice_id" varchar(255),
	"subscription_id" varchar(255),
	"subscription_status" "subscription_status",
	"subscription_active_on" date,
	"subscription_expires_on" date,
	"paid_at" timestamp,
	"certificate_id" varchar(255),
	"certificate_generated_at" timestamp,
	"started_at" timestamp,
	"access_till" date,
	"override_access_days" integer,
	"utm_source" varchar(100),
	"utm_medium" varchar(100),
	"utm_campaign" varchar(150),
	"remark" text,
	"sequential_learning" boolean,
	"sequential_learning_with_assignments" boolean,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "batch_enrollments_certificate_id_unique" UNIQUE("certificate_id")
);
--> statement-breakpoint
CREATE TABLE "batch_live_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"batch_id" uuid NOT NULL,
	"section_id" uuid,
	"topic" varchar(255) NOT NULL,
	"desc" text,
	"time" timestamp NOT NULL,
	"screen_hls_video" varchar(255),
	"face_hls_video" varchar(255),
	"recording_hls" varchar(255),
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "batch_sections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"batch_id" uuid,
	"order" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "batches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"topic" varchar(255),
	"name" varchar(255) NOT NULL,
	"description" varchar(255),
	"slug" varchar(255),
	"price" integer,
	"certificate_fee" integer DEFAULT 0 NOT NULL,
	"limit" integer DEFAULT 0,
	"img" varchar(255),
	"association" varchar(255),
	"logo" varchar(255),
	"type" "batch_type" DEFAULT 'cohort' NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"whatsapp_link" varchar(255),
	"telegram_link" varchar(255),
	"telegram_broadcast" varchar(255),
	"teacher_id" uuid,
	"teacher_payment" boolean DEFAULT false NOT NULL,
	"meeting_link" varchar(255),
	"next_class_topic" varchar(255),
	"desc" varchar(255),
	"next_class" timestamp,
	"status" "batch_status" DEFAULT 'private' NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"access_till_date" date,
	"access_till_year" integer DEFAULT 1,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "content_library" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"desc" text,
	"type" "content_library_type" NOT NULL,
	"content_type" "content_type_class" DEFAULT 'primary' NOT NULL,
	"video_link" varchar(255),
	"video_duration" integer,
	"assignment" text,
	"xp" integer,
	"solution_code" text,
	"hints" jsonb,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "course_progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"enrollment_id" uuid NOT NULL,
	"batch_content_id" uuid,
	"batch_live_session_id" uuid,
	"time_spent" integer DEFAULT 0 NOT NULL,
	"live_session_time_spent" integer DEFAULT 0 NOT NULL,
	"progress" integer DEFAULT 0 NOT NULL,
	"status" "user_status" DEFAULT 'not_started' NOT NULL,
	"github_link" varchar(255),
	"deployed_link" varchar(255),
	"assignment_status" "assignment_status",
	"user_remark" text,
	"teacher_remark" text,
	"video_feedback" text,
	"code_submitted" text,
	"code_submitted_status" "code_submitted_status",
	"last_watched_position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "job_audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_id" varchar(255) NOT NULL,
	"queue_name" varchar(100) NOT NULL,
	"job_name" varchar(100) NOT NULL,
	"status" "job_status" DEFAULT 'pending' NOT NULL,
	"payload" jsonb DEFAULT '{}'::jsonb,
	"result" jsonb DEFAULT '{}'::jsonb,
	"error" text,
	"duration_ms" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reported_bugs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"description" text NOT NULL,
	"url" varchar(1024),
	"severity" "bug_severity" DEFAULT 'medium' NOT NULL,
	"status" "bug_status" DEFAULT 'pending' NOT NULL,
	"device_info" jsonb DEFAULT '{}'::jsonb,
	"screenshot_url" varchar(255),
	"remarks" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "system_settings" (
	"key" varchar(100) PRIMARY KEY NOT NULL,
	"value" jsonb NOT NULL,
	"description" text,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255),
	"name" varchar(255),
	"mobile" varchar(20),
	"avatar_url" text,
	"bio" text,
	"linkedin_url" text,
	"github_url" text,
	"occupation_type" "occupation_type" DEFAULT 'other' NOT NULL,
	"occupation_title" varchar(100),
	"organization" varchar(150),
	"experience_years" smallint,
	"role" "role" DEFAULT 'student' NOT NULL,
	"status" "status" DEFAULT 'active' NOT NULL,
	"google_id" varchar(255),
	"email_verified" boolean DEFAULT false NOT NULL,
	"xp" integer DEFAULT 0 NOT NULL,
	"current_streak" integer DEFAULT 0 NOT NULL,
	"longest_streak" integer DEFAULT 0 NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"last_active_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "batch_content" ADD CONSTRAINT "batch_content_batch_id_batches_id_fk" FOREIGN KEY ("batch_id") REFERENCES "public"."batches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "batch_content" ADD CONSTRAINT "batch_content_content_id_content_library_id_fk" FOREIGN KEY ("content_id") REFERENCES "public"."content_library"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "batch_content" ADD CONSTRAINT "batch_content_section_id_batch_sections_id_fk" FOREIGN KEY ("section_id") REFERENCES "public"."batch_sections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "batch_enrollment_payments" ADD CONSTRAINT "batch_enrollment_payments_batch_enrollment_id_batch_enrollments_id_fk" FOREIGN KEY ("batch_enrollment_id") REFERENCES "public"."batch_enrollments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "batch_enrollments" ADD CONSTRAINT "batch_enrollments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "batch_enrollments" ADD CONSTRAINT "batch_enrollments_batch_id_batches_id_fk" FOREIGN KEY ("batch_id") REFERENCES "public"."batches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "batch_live_sessions" ADD CONSTRAINT "batch_live_sessions_batch_id_batches_id_fk" FOREIGN KEY ("batch_id") REFERENCES "public"."batches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "batch_live_sessions" ADD CONSTRAINT "batch_live_sessions_section_id_batch_sections_id_fk" FOREIGN KEY ("section_id") REFERENCES "public"."batch_sections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "batch_sections" ADD CONSTRAINT "batch_sections_batch_id_batches_id_fk" FOREIGN KEY ("batch_id") REFERENCES "public"."batches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "batches" ADD CONSTRAINT "batches_teacher_id_users_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_progress" ADD CONSTRAINT "course_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_progress" ADD CONSTRAINT "course_progress_enrollment_id_batch_enrollments_id_fk" FOREIGN KEY ("enrollment_id") REFERENCES "public"."batch_enrollments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_progress" ADD CONSTRAINT "course_progress_batch_content_id_batch_content_id_fk" FOREIGN KEY ("batch_content_id") REFERENCES "public"."batch_content"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_progress" ADD CONSTRAINT "course_progress_batch_live_session_id_batch_live_sessions_id_fk" FOREIGN KEY ("batch_live_session_id") REFERENCES "public"."batch_live_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reported_bugs" ADD CONSTRAINT "reported_bugs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "batch_content_batch_id_idx" ON "batch_content" USING btree ("batch_id");--> statement-breakpoint
CREATE INDEX "batch_content_content_id_idx" ON "batch_content" USING btree ("content_id");--> statement-breakpoint
CREATE INDEX "batch_content_section_id_idx" ON "batch_content" USING btree ("section_id");--> statement-breakpoint
CREATE INDEX "batch_payments_paid_at_idx" ON "batch_enrollment_payments" USING btree ("paid_at");--> statement-breakpoint
CREATE INDEX "batch_payments_batch_enrollment_id_idx" ON "batch_enrollment_payments" USING btree ("batch_enrollment_id");--> statement-breakpoint
CREATE INDEX "enrollments_user_id_idx" ON "batch_enrollments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "enrollments_batch_id_idx" ON "batch_enrollments" USING btree ("batch_id");--> statement-breakpoint
CREATE INDEX "enrollments_payment_status_idx" ON "batch_enrollments" USING btree ("payment_status");--> statement-breakpoint
CREATE INDEX "enrollments_created_at_idx" ON "batch_enrollments" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "batch_live_sessions_batch_id_idx" ON "batch_live_sessions" USING btree ("batch_id");--> statement-breakpoint
CREATE INDEX "batch_live_sessions_section_id_idx" ON "batch_live_sessions" USING btree ("section_id");--> statement-breakpoint
CREATE INDEX "batch_sections_batch_id_idx" ON "batch_sections" USING btree ("batch_id");--> statement-breakpoint
CREATE INDEX "batches_slug_idx" ON "batches" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "content_library_type_idx" ON "content_library" USING btree ("type");--> statement-breakpoint
CREATE INDEX "content_library_content_type_idx" ON "content_library" USING btree ("content_type");--> statement-breakpoint
CREATE INDEX "content_library_title_idx" ON "content_library" USING btree ("title");--> statement-breakpoint
CREATE INDEX "course_progress_batch_content_id_idx" ON "course_progress" USING btree ("batch_content_id");--> statement-breakpoint
CREATE INDEX "course_progress_batch_live_session_id_idx" ON "course_progress" USING btree ("batch_live_session_id");--> statement-breakpoint
CREATE UNIQUE INDEX "course_progress_enrollment_content_uniq_idx" ON "course_progress" USING btree ("enrollment_id","batch_content_id");--> statement-breakpoint
CREATE UNIQUE INDEX "course_progress_enrollment_live_session_uniq_idx" ON "course_progress" USING btree ("enrollment_id","batch_live_session_id");--> statement-breakpoint
CREATE INDEX "course_progress_user_id_idx" ON "course_progress" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "course_progress_assignment_status_updated_at_idx" ON "course_progress" USING btree ("assignment_status","updated_at");--> statement-breakpoint
CREATE INDEX "job_audit_logs_job_id_idx" ON "job_audit_logs" USING btree ("job_id");--> statement-breakpoint
CREATE INDEX "job_audit_logs_queue_name_idx" ON "job_audit_logs" USING btree ("queue_name");--> statement-breakpoint
CREATE INDEX "job_audit_logs_status_idx" ON "job_audit_logs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "job_audit_logs_created_at_idx" ON "job_audit_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "reported_bugs_user_id_idx" ON "reported_bugs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "reported_bugs_status_idx" ON "reported_bugs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "reported_bugs_created_at_idx" ON "reported_bugs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "users_name_idx" ON "users" USING btree ("name");--> statement-breakpoint
CREATE INDEX "users_mobile_idx" ON "users" USING btree ("mobile");--> statement-breakpoint
CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "users_name_trgm_idx" ON "users" USING gin ("name" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "users_email_trgm_idx" ON "users" USING gin ("email" gin_trgm_ops);