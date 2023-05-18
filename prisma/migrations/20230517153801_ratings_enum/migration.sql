/*
  Warnings:

  - Changed the type of `rating` on the `CommentRatings` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "CommentRating" AS ENUM ('up', 'down');

-- AlterTable
ALTER TABLE "CommentRatings" DROP COLUMN "rating",
ADD COLUMN     "rating" "CommentRating" NOT NULL;
