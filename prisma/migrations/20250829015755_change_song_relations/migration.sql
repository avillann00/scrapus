/*
  Warnings:

  - You are about to drop the column `photoId` on the `Song` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[songId]` on the table `Photo` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Song" DROP CONSTRAINT "Song_photoId_fkey";

-- DropIndex
DROP INDEX "Song_photoId_key";

-- AlterTable
ALTER TABLE "Photo" ADD COLUMN     "songId" TEXT;

-- AlterTable
ALTER TABLE "Song" DROP COLUMN "photoId";

-- CreateIndex
CREATE UNIQUE INDEX "Photo_songId_key" ON "Photo"("songId");

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE SET NULL ON UPDATE CASCADE;
