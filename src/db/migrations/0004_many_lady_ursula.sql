CREATE TABLE "learner_watchlist" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"enrollment_id" uuid NOT NULL,
	"batch_id" uuid NOT NULL,
	"reason" text,
	"added_by" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "learner_watchlist" ADD CONSTRAINT "learner_watchlist_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "learner_watchlist" ADD CONSTRAINT "learner_watchlist_enrollment_id_batch_enrollments_id_fk" FOREIGN KEY ("enrollment_id") REFERENCES "public"."batch_enrollments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "learner_watchlist" ADD CONSTRAINT "learner_watchlist_batch_id_batches_id_fk" FOREIGN KEY ("batch_id") REFERENCES "public"."batches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "learner_watchlist" ADD CONSTRAINT "learner_watchlist_added_by_users_id_fk" FOREIGN KEY ("added_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "learner_watchlist_user_batch_uniq_idx" ON "learner_watchlist" USING btree ("user_id","batch_id");--> statement-breakpoint
CREATE INDEX "learner_watchlist_batch_id_idx" ON "learner_watchlist" USING btree ("batch_id");--> statement-breakpoint
CREATE INDEX "learner_watchlist_user_id_idx" ON "learner_watchlist" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "learner_watchlist_enrollment_id_idx" ON "learner_watchlist" USING btree ("enrollment_id");--> statement-breakpoint
CREATE INDEX "learner_watchlist_created_at_idx" ON "learner_watchlist" USING btree ("created_at");