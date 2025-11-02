-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- AlterTable
ALTER TABLE "memories" ADD COLUMN     "embedding" vector(1536);
