-- DropIndex
DROP INDEX "public"."memories_embedding_idx";

-- AlterTable
ALTER TABLE "memories" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::text;
