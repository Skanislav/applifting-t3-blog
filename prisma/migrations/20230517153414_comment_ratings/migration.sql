-- CreateTable
CREATE TABLE "CommentRatings" (
    "id" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "rating" TEXT NOT NULL,
    "userIp" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommentRatings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CommentRatings_commentId_userIp_key" ON "CommentRatings"("commentId", "userIp");

-- AddForeignKey
ALTER TABLE "CommentRatings" ADD CONSTRAINT "CommentRatings_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
