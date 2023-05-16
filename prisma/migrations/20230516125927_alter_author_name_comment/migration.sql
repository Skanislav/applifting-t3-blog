/*
  Warnings:

  - You are about to drop the column `author_name` on the `Comment` table. All the data in the column will be lost.
  - Added the required column `authorName` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "author_name",
ADD COLUMN     "authorName" TEXT NOT NULL;
