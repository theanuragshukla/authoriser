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
CREATE TABLE IF NOT EXISTS "appInfo" (
	"appId" varchar(64) PRIMARY KEY NOT NULL,
	"app_name" varchar(32) NOT NULL,
	"app_desc" varchar(100),
	"app_logo" text,
	"app_policy" text,
	"app_tos" text,
	CONSTRAINT "appInfo_appId_unique" UNIQUE("appId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "apps" (
	"appId" varchar(64) PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"uid" varchar(32) NOT NULL,
	CONSTRAINT "apps_appId_unique" UNIQUE("appId"),
	CONSTRAINT "apps_uid_unique" UNIQUE("uid")
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
 ALTER TABLE "appInfo" ADD CONSTRAINT "appInfo_appId_apps_appId_fk" FOREIGN KEY ("appId") REFERENCES "apps"("appId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "apps" ADD CONSTRAINT "apps_uid_users_uid_fk" FOREIGN KEY ("uid") REFERENCES "users"("uid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
