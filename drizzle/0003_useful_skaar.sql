ALTER TABLE "embeddings" RENAME COLUMN "user_id" TO "bot_id";--> statement-breakpoint
ALTER TABLE "embeddings" DROP CONSTRAINT "embeddings_user_id_users_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "embeddings" ADD CONSTRAINT "embeddings_bot_id_bots_id_fk" FOREIGN KEY ("bot_id") REFERENCES "public"."bots"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
