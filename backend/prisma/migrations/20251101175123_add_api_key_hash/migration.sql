-- AlterTable
ALTER TABLE "memories" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::text;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "api_key_hash" TEXT;
