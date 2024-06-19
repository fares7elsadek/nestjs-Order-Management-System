/*
  Warnings:

  - Added the required column `coupon` to the `Coupon` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Coupon" ADD COLUMN     "coupon" TEXT NOT NULL;
