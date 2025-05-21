/*
  Warnings:

  - Made the column `highlight` on table `image` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "image_highlight_key";

-- AlterTable
ALTER TABLE "image" ALTER COLUMN "highlight" SET NOT NULL,
ALTER COLUMN "highlight" SET DEFAULT false;
