-- DropForeignKey
ALTER TABLE "gears" DROP CONSTRAINT "gears_providerId_fkey";

-- AddForeignKey
ALTER TABLE "gears" ADD CONSTRAINT "gears_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
