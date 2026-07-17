/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `gears` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[brand]` on the table `gears` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "gears_brand_title_providerId_key";

-- CreateIndex
CREATE UNIQUE INDEX "gears_title_key" ON "gears"("title");

-- CreateIndex
CREATE UNIQUE INDEX "gears_brand_key" ON "gears"("brand");
