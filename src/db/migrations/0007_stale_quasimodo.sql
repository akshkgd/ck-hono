ALTER TABLE "course_progress" ALTER COLUMN "batch_content_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "course_progress" ADD COLUMN "batch_live_session_id" uuid;--> statement-breakpoint
ALTER TABLE "course_progress" ADD COLUMN "live_session_time_spent" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "course_progress" ADD CONSTRAINT "course_progress_batch_live_session_id_batch_live_sessions_id_fk" FOREIGN KEY ("batch_live_session_id") REFERENCES "public"."batch_live_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "course_progress_batch_live_session_id_idx" ON "course_progress" USING btree ("batch_live_session_id");--> statement-breakpoint
CREATE UNIQUE INDEX "course_progress_enrollment_live_session_uniq_idx" ON "course_progress" USING btree ("enrollment_id","batch_live_session_id");