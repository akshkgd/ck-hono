CREATE TYPE "public"."batch_status" AS ENUM('active', 'private', 'completed');--> statement-breakpoint
CREATE TYPE "public"."batch_type" AS ENUM('cohort', 'live', 'webinar', 'callBooking', 'mentorship');--> statement-breakpoint
CREATE TYPE "public"."content_library_type" AS ENUM('video', 'coding lab', 'assignment', 'article');--> statement-breakpoint
CREATE TYPE "public"."content_type_class" AS ENUM('primary', 'secondary');--> statement-breakpoint
CREATE TYPE "public"."enrollment_type" AS ENUM('oneTime', 'Subscription', 'free');--> statement-breakpoint
CREATE TYPE "public"."occupation_type" AS ENUM('student', 'professional', 'academic', 'other');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('captured', 'failed', 'created', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('student', 'admin', 'user', 'moderator');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('active', 'inactive', 'suspended');--> statement-breakpoint
CREATE TYPE "public"."subscription_status" AS ENUM('active', 'expired', 'pending');--> statement-breakpoint
CREATE TABLE "batch_enrollment_payments" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"batch_enrollment_id" bigint NOT NULL,
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
	CONSTRAINT "batch_enrollment_payments_transaction_id_unique" UNIQUE("transaction_id"),
	CONSTRAINT "batch_enrollment_payments_invoice_id_unique" UNIQUE("invoice_id")
);
--> statement-breakpoint
CREATE TABLE "batch_enrollments" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"batch_id" bigint NOT NULL,
	"amount_payable" integer,
	"enrollment_type" "enrollment_type" DEFAULT 'oneTime' NOT NULL,
	"status" smallint DEFAULT 0 NOT NULL,
	"progress" integer DEFAULT 0 NOT NULL,
	"time_spent_seconds" integer DEFAULT 0 NOT NULL,
	"amount_paid" integer,
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
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "batch_enrollments_certificate_id_unique" UNIQUE("certificate_id")
);
--> statement-breakpoint
CREATE TABLE "batch_sections" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"batch_id" bigint,
	"order" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "batches" (
	"id" bigserial PRIMARY KEY NOT NULL,
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
	"id" bigserial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"desc" text,
	"type" "content_library_type" NOT NULL,
	"content_type" "content_type_class" DEFAULT 'primary' NOT NULL,
	"video_link" varchar(255),
	"solution_code" text,
	"hints" jsonb,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
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
ALTER TABLE "batch_enrollment_payments" ADD CONSTRAINT "batch_enrollment_payments_batch_enrollment_id_batch_enrollments_id_fk" FOREIGN KEY ("batch_enrollment_id") REFERENCES "public"."batch_enrollments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "batch_enrollments" ADD CONSTRAINT "batch_enrollments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "batch_enrollments" ADD CONSTRAINT "batch_enrollments_batch_id_batches_id_fk" FOREIGN KEY ("batch_id") REFERENCES "public"."batches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "batch_sections" ADD CONSTRAINT "batch_sections_batch_id_batches_id_fk" FOREIGN KEY ("batch_id") REFERENCES "public"."batches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "batches" ADD CONSTRAINT "batches_teacher_id_users_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "batch_sections_batch_id_idx" ON "batch_sections" USING btree ("batch_id");--> statement-breakpoint
CREATE INDEX "batches_slug_idx" ON "batches" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "content_library_type_idx" ON "content_library" USING btree ("type");--> statement-breakpoint
CREATE INDEX "users_name_idx" ON "users" USING btree ("name");--> statement-breakpoint
CREATE INDEX "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "users_mobile_idx" ON "users" USING btree ("mobile");