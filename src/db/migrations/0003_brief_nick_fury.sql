CREATE EXTENSION IF NOT EXISTS "pg_trgm";--> statement-breakpoint
CREATE TYPE "public"."assignment_status" AS ENUM('pending', 'submitted', 'under review', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."bug_severity" AS ENUM('low', 'medium', 'high', 'critical');--> statement-breakpoint
CREATE TYPE "public"."bug_status" AS ENUM('pending', 'investigating', 'resolved', 'closed');--> statement-breakpoint
CREATE TYPE "public"."code_submitted_status" AS ENUM('Accepted', 'rejected', 'attempted');--> statement-breakpoint
CREATE TYPE "public"."job_status" AS ENUM('pending', 'processing', 'completed', 'failed');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
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
	"title" varchar(255) NOT NULL,
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
	"id" text PRIMARY KEY NOT NULL,
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
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "batch_enrollment_payments" DROP CONSTRAINT "batch_enrollment_payments_invoice_id_unique";--> statement-breakpoint
ALTER TABLE "batch_content" ALTER COLUMN "id" SET DATA TYPE uuid USING "id"::uuid;--> statement-breakpoint
ALTER TABLE "batch_content" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "batch_content" ALTER COLUMN "batch_id" SET DATA TYPE uuid USING "batch_id"::uuid;--> statement-breakpoint
ALTER TABLE "batch_content" ALTER COLUMN "content_id" SET DATA TYPE uuid USING "content_id"::uuid;--> statement-breakpoint
ALTER TABLE "batch_content" ALTER COLUMN "section_id" SET DATA TYPE uuid USING "section_id"::uuid;--> statement-breakpoint
ALTER TABLE "batch_enrollment_payments" ALTER COLUMN "id" SET DATA TYPE uuid USING "id"::uuid;--> statement-breakpoint
ALTER TABLE "batch_enrollment_payments" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "batch_enrollment_payments" ALTER COLUMN "batch_enrollment_id" SET DATA TYPE uuid USING "batch_enrollment_id"::uuid;--> statement-breakpoint
ALTER TABLE "batch_enrollments" ALTER COLUMN "id" SET DATA TYPE uuid USING "id"::uuid;--> statement-breakpoint
ALTER TABLE "batch_enrollments" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "batch_enrollments" ALTER COLUMN "batch_id" SET DATA TYPE uuid USING "batch_id"::uuid;--> statement-breakpoint
ALTER TABLE "batch_sections" ALTER COLUMN "id" SET DATA TYPE uuid USING "id"::uuid;--> statement-breakpoint
ALTER TABLE "batch_sections" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "batch_sections" ALTER COLUMN "batch_id" SET DATA TYPE uuid USING "batch_id"::uuid;--> statement-breakpoint
ALTER TABLE "batches" ALTER COLUMN "id" SET DATA TYPE uuid USING "id"::uuid;--> statement-breakpoint
ALTER TABLE "batches" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "content_library" ALTER COLUMN "id" SET DATA TYPE uuid USING "id"::uuid;--> statement-breakpoint
ALTER TABLE "content_library" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "course_progress" ALTER COLUMN "id" SET DATA TYPE uuid USING "id"::uuid;--> statement-breakpoint
ALTER TABLE "course_progress" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "course_progress" ALTER COLUMN "enrollment_id" SET DATA TYPE uuid USING "enrollment_id"::uuid;--> statement-breakpoint
ALTER TABLE "course_progress" ALTER COLUMN "batch_content_id" SET DATA TYPE uuid USING "batch_content_id"::uuid;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "batch_content" ADD COLUMN "can_submit_assignment" boolean;--> statement-breakpoint
ALTER TABLE "batch_enrollments" ADD COLUMN "sequential_learning" boolean;--> statement-breakpoint
ALTER TABLE "batch_enrollments" ADD COLUMN "sequential_learning_with_assignments" boolean;--> statement-breakpoint
ALTER TABLE "content_library" ADD COLUMN "video_duration" integer;--> statement-breakpoint
ALTER TABLE "content_library" ADD COLUMN "assignment" text;--> statement-breakpoint
ALTER TABLE "content_library" ADD COLUMN "xp" integer;--> statement-breakpoint
ALTER TABLE "course_progress" ADD COLUMN "github_link" varchar(255);--> statement-breakpoint
ALTER TABLE "course_progress" ADD COLUMN "deployed_link" varchar(255);--> statement-breakpoint
ALTER TABLE "course_progress" ADD COLUMN "assignment_status" "assignment_status";--> statement-breakpoint
ALTER TABLE "course_progress" ADD COLUMN "user_remark" text;--> statement-breakpoint
ALTER TABLE "course_progress" ADD COLUMN "teacher_remark" text;--> statement-breakpoint
ALTER TABLE "course_progress" ADD COLUMN "video_feedback" text;--> statement-breakpoint
ALTER TABLE "course_progress" ADD COLUMN "code_submitted" text;--> statement-breakpoint
ALTER TABLE "course_progress" ADD COLUMN "code_submitted_status" "code_submitted_status";--> statement-breakpoint
ALTER TABLE "course_progress" ADD COLUMN "last_watched_position" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reported_bugs" ADD CONSTRAINT "reported_bugs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "job_audit_logs_job_id_idx" ON "job_audit_logs" USING btree ("job_id");--> statement-breakpoint
CREATE INDEX "job_audit_logs_queue_name_idx" ON "job_audit_logs" USING btree ("queue_name");--> statement-breakpoint
CREATE INDEX "job_audit_logs_status_idx" ON "job_audit_logs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "job_audit_logs_created_at_idx" ON "job_audit_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "reported_bugs_user_id_idx" ON "reported_bugs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "reported_bugs_status_idx" ON "reported_bugs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "reported_bugs_created_at_idx" ON "reported_bugs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "course_progress_user_id_idx" ON "course_progress" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "course_progress_assignment_status_updated_at_idx" ON "course_progress" USING btree ("assignment_status","updated_at");--> statement-breakpoint
CREATE INDEX "users_name_trgm_idx" ON "users" USING gin ("name" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "users_email_trgm_idx" ON "users" USING gin ("email" gin_trgm_ops);