CREATE TYPE "public"."user_status" AS ENUM('not_started', 'learning', 'completed');--> statement-breakpoint
CREATE TABLE "batch_content" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"batch_id" bigint NOT NULL,
	"content_id" bigint NOT NULL,
	"section_id" bigint NOT NULL,
	"order" integer,
	"access_on" integer DEFAULT 0 NOT NULL,
	"access_till" integer DEFAULT 0 NOT NULL,
	"access_on_date" date,
	"access_till_date" date,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "course_progress" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"enrollment_id" bigint NOT NULL,
	"batch_content_id" bigint NOT NULL,
	"time_spent" integer DEFAULT 0 NOT NULL,
	"progress" integer DEFAULT 0 NOT NULL,
	"status" "user_status" DEFAULT 'not_started' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "batch_enrollments" DROP CONSTRAINT "batch_enrollments_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "batches" DROP CONSTRAINT "batches_teacher_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "batch_enrollments" ALTER COLUMN "amount_paid" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "batch_enrollments" ALTER COLUMN "amount_paid" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "batch_content" ADD CONSTRAINT "batch_content_batch_id_batches_id_fk" FOREIGN KEY ("batch_id") REFERENCES "public"."batches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "batch_content" ADD CONSTRAINT "batch_content_content_id_content_library_id_fk" FOREIGN KEY ("content_id") REFERENCES "public"."content_library"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "batch_content" ADD CONSTRAINT "batch_content_section_id_batch_sections_id_fk" FOREIGN KEY ("section_id") REFERENCES "public"."batch_sections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_progress" ADD CONSTRAINT "course_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_progress" ADD CONSTRAINT "course_progress_enrollment_id_batch_enrollments_id_fk" FOREIGN KEY ("enrollment_id") REFERENCES "public"."batch_enrollments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_progress" ADD CONSTRAINT "course_progress_batch_content_id_batch_content_id_fk" FOREIGN KEY ("batch_content_id") REFERENCES "public"."batch_content"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "batch_content_batch_id_idx" ON "batch_content" USING btree ("batch_id");--> statement-breakpoint
CREATE INDEX "batch_content_content_id_idx" ON "batch_content" USING btree ("content_id");--> statement-breakpoint
CREATE INDEX "batch_content_section_id_idx" ON "batch_content" USING btree ("section_id");--> statement-breakpoint
CREATE INDEX "course_progress_batch_content_id_idx" ON "course_progress" USING btree ("batch_content_id");--> statement-breakpoint
CREATE UNIQUE INDEX "course_progress_enrollment_content_uniq_idx" ON "course_progress" USING btree ("enrollment_id","batch_content_id");--> statement-breakpoint
ALTER TABLE "batch_enrollments" ADD CONSTRAINT "batch_enrollments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "batches" ADD CONSTRAINT "batches_teacher_id_users_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "batch_payments_paid_at_idx" ON "batch_enrollment_payments" USING btree ("paid_at");--> statement-breakpoint
CREATE INDEX "batch_payments_batch_enrollment_id_idx" ON "batch_enrollment_payments" USING btree ("batch_enrollment_id");--> statement-breakpoint
CREATE INDEX "enrollments_user_id_idx" ON "batch_enrollments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "enrollments_batch_id_idx" ON "batch_enrollments" USING btree ("batch_id");--> statement-breakpoint
CREATE INDEX "enrollments_payment_status_idx" ON "batch_enrollments" USING btree ("payment_status");--> statement-breakpoint
CREATE INDEX "enrollments_created_at_idx" ON "batch_enrollments" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "content_library_content_type_idx" ON "content_library" USING btree ("content_type");--> statement-breakpoint
CREATE INDEX "content_library_title_idx" ON "content_library" USING btree ("title");--> statement-breakpoint
CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");