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
ALTER TABLE "batch_live_sessions" ADD CONSTRAINT "batch_live_sessions_batch_id_batches_id_fk" FOREIGN KEY ("batch_id") REFERENCES "public"."batches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "batch_live_sessions" ADD CONSTRAINT "batch_live_sessions_section_id_batch_sections_id_fk" FOREIGN KEY ("section_id") REFERENCES "public"."batch_sections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "batch_live_sessions_batch_id_idx" ON "batch_live_sessions" USING btree ("batch_id");--> statement-breakpoint
CREATE INDEX "batch_live_sessions_section_id_idx" ON "batch_live_sessions" USING btree ("section_id");