/*
  Warnings:

  - Added the required column `cep` to the `property` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "property" ADD COLUMN     "cep" INTEGER NOT NULL;
