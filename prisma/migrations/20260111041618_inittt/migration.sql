/*
  Warnings:

  - A unique constraint covering the columns `[AdmissionNo]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `examId` to the `Mark` table without a default value. This is not possible if the table is not empty.
  - Added the required column `AdmissionNo` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Mark" ADD COLUMN     "examId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "AdmissionNo" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Exam" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Exam_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Mark_examId_idx" ON "Mark"("examId");

-- CreateIndex
CREATE UNIQUE INDEX "Student_AdmissionNo_key" ON "Student"("AdmissionNo");

-- AddForeignKey
ALTER TABLE "Mark" ADD CONSTRAINT "Mark_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
