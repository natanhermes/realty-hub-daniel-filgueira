/*
  Warnings:

  - A unique constraint covering the columns `[highlight]` on the table `image` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "image" ALTER COLUMN "highlight" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "image_highlight_key" ON "image"("highlight");
