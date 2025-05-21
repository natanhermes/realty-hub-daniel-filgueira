/*
  Warnings:

  - Added the required column `city` to the `property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `number` to the `property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `property` table without a default value. This is not possible if the table is not empty.
  - Made the column `neighborhood` on table `property` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "property" ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "number" TEXT NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL,
ADD COLUMN     "street" TEXT NOT NULL,
ALTER COLUMN "neighborhood" SET NOT NULL;
