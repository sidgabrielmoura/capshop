-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "category" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "specifications" TEXT[] DEFAULT ARRAY['']::TEXT[];
