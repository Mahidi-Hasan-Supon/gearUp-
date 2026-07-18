-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "customerId" TEXT NOT NULL,
    "gearId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "reviews_customerId_idx" ON "reviews"("customerId");

-- CreateIndex
CREATE INDEX "reviews_gearId_idx" ON "reviews"("gearId");

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_gearId_fkey" FOREIGN KEY ("gearId") REFERENCES "gears"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
