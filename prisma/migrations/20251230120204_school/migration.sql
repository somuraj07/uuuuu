/*
  Warnings:

  - Added the required column `city` to the `School` table without a default value. This is not possible if the table is not empty.
  - Added the required column `district` to the `School` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pincode` to the `School` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `School` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "NewsFeed" ADD COLUMN     "tagline" TEXT;

-- AlterTable
ALTER TABLE "School" ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "district" TEXT NOT NULL,
ADD COLUMN     "icon" TEXT,
ADD COLUMN     "pincode" TEXT NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL;
