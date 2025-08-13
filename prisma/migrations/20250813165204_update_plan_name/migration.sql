-- DropIndex
DROP INDEX "public"."Plan_name_key";

-- AlterTable
ALTER TABLE "public"."Plan" ALTER COLUMN "name" SET DEFAULT 'Free';
