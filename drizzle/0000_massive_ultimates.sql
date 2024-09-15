CREATE TABLE IF NOT EXISTS "agents" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"name" text NOT NULL,
	CONSTRAINT "agents_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bots" (
	"id" text PRIMARY KEY NOT NULL,
	"agent_id" text,
	"chat_bot_title" text NOT NULL,
	"welcome_message" text NOT NULL,
	"widget_color" text NOT NULL,
	"collect_visitor_info" boolean NOT NULL,
	"widget_button_position" text NOT NULL,
	"font_family" text NOT NULL,
	"font_url" text NOT NULL,
	"convo_starters" text[],
	"profile_description" text NOT NULL,
	"placeholder" text NOT NULL,
	"style" text NOT NULL,
	"show_popup_text" boolean NOT NULL,
	"popup_text" text NOT NULL,
	"expand_by_default" boolean NOT NULL,
	"remove_powered_by" boolean NOT NULL,
	"chat_is_locked" boolean NOT NULL,
	"typing_message" text NOT NULL,
	"user_id" text NOT NULL,
	"bot_interactions" integer DEFAULT 0,
	CONSTRAINT "bots_agent_id_unique" UNIQUE("agent_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"expires_at" timestamp NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"username" text,
	"github_id" integer,
	"email" text NOT NULL,
	"name" text,
	"password" text,
	"profile_picture" text DEFAULT 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
	CONSTRAINT "users_github_id_unique" UNIQUE("github_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "visitors" (
	"id" serial PRIMARY KEY NOT NULL,
	"bot_id" text,
	"name" varchar(255),
	"email" varchar(255),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "agents" ADD CONSTRAINT "agents_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bots" ADD CONSTRAINT "bots_agent_id_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."agents"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "visitors" ADD CONSTRAINT "visitors_bot_id_bots_id_fk" FOREIGN KEY ("bot_id") REFERENCES "public"."bots"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
