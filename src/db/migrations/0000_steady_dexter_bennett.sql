CREATE TABLE IF NOT EXISTS "app_creds" (
	"appId" varchar(64) PRIMARY KEY NOT NULL,
	"client_id" uuid,
	"client_secret" text,
	CONSTRAINT "app_creds_appId_unique" UNIQUE("appId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "app_details" (
	"appId" varchar(64) PRIMARY KEY NOT NULL,
	"redirect_uri" varchar(200),
	"homepage" varchar(200),
	"support_email" varchar(100),
	CONSTRAINT "app_details_appId_unique" UNIQUE("appId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "app_info" (
	"appId" varchar(64) PRIMARY KEY NOT NULL,
	"app_name" varchar(32) NOT NULL,
	"app_desc" varchar(100),
	"app_logo" text,
	"app_policy" text,
	"app_tos" text,
	CONSTRAINT "app_info_appId_unique" UNIQUE("appId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "apps" (
	"appId" varchar(64) PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"uid" varchar(32) NOT NULL,
	CONSTRAINT "apps_appId_unique" UNIQUE("appId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "authseed" (
	"uid" varchar(32) PRIMARY KEY NOT NULL,
	"sessions" json DEFAULT '{}'::json,
	CONSTRAINT "authseed_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "client_access_seeds" (
	"uid" varchar(32) NOT NULL,
	"appId" varchar(64) NOT NULL,
	"seeds" json DEFAULT '{}'::json,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial NOT NULL,
	"uid" varchar(32) PRIMARY KEY NOT NULL,
	"first_name" varchar(32) NOT NULL,
	"last_name" varchar(32),
	"email" varchar(128) NOT NULL,
	"password" text NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL,
	"is_developer" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_uid_unique" UNIQUE("uid"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "app_creds" ADD CONSTRAINT "app_creds_appId_apps_appId_fk" FOREIGN KEY ("appId") REFERENCES "apps"("appId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "app_details" ADD CONSTRAINT "app_details_appId_apps_appId_fk" FOREIGN KEY ("appId") REFERENCES "apps"("appId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "app_info" ADD CONSTRAINT "app_info_appId_apps_appId_fk" FOREIGN KEY ("appId") REFERENCES "apps"("appId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "apps" ADD CONSTRAINT "apps_uid_users_uid_fk" FOREIGN KEY ("uid") REFERENCES "users"("uid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "authseed" ADD CONSTRAINT "authseed_uid_users_uid_fk" FOREIGN KEY ("uid") REFERENCES "users"("uid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "client_access_seeds" ADD CONSTRAINT "client_access_seeds_uid_users_uid_fk" FOREIGN KEY ("uid") REFERENCES "users"("uid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "client_access_seeds" ADD CONSTRAINT "client_access_seeds_appId_apps_appId_fk" FOREIGN KEY ("appId") REFERENCES "apps"("appId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
