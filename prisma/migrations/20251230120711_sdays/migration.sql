/*
  Warnings:

  - Added the required column `days` to the `LeaveRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LeaveRequest" ADD COLUMN     "days" TEXT NOT NULL;
