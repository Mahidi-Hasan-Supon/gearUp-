/*
  Warnings:

  - A unique constraint covering the columns `[title,brand,providerId]` on the table `gears` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "gears_title_brand_providerId_key" ON "gears"("title", "brand", "providerId");
