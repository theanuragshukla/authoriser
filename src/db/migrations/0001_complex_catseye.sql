ALTER TABLE "authseed" RENAME COLUMN "access" TO "seed";--> statement-breakpoint
ALTER TABLE "authseed" DROP COLUMN IF EXISTS "refresh";