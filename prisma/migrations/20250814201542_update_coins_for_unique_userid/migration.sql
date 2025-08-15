/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Coins` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Coins_userId_key" ON "public"."Coins"("userId");
