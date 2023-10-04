CREATE TABLE IF NOT EXISTS "authseed" (
	"uid" varchar(32) PRIMARY KEY NOT NULL,
	"access" varchar(16)[],
	"refresh" varchar(16)[],
	CONSTRAINT "authseed_uid_unique" UNIQUE("uid")
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
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_uid_unique" UNIQUE("uid"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "authseed" ADD CONSTRAINT "authseed_uid_users_uid_fk" FOREIGN KEY ("uid") REFERENCES "users"("uid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
