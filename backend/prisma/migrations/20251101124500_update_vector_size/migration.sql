-- AlterTable: Change embedding vector size from 1536 to 384
ALTER TABLE "memories" ALTER COLUMN "embedding" TYPE vector(384);
