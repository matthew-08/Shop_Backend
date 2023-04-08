/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `UserCart` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserCart_userId_key" ON "UserCart"("userId");
