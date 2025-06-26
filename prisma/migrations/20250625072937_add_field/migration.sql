/*
  Warnings:

  - A unique constraint covering the columns `[domain]` on the table `Captain` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Captain_domain_key" ON "Captain"("domain");
