/*
  Warnings:

  - A unique constraint covering the columns `[brand,title,providerId]` on the table `gears` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "gears_brand_title_providerId_key" ON "gears"("brand", "title", "providerId");
