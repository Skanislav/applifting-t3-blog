import { type CommentRatings, Prisma, type PrismaClient } from "@prisma/client";

import { type ArticleComment } from "~/lib/models";
import { type RouterInputs } from "~/utils/api";

export interface CommentsRepository {
  createComment(
    data: RouterInputs["comments"]["createNewComment"]
  ): Promise<ArticleComment>;

  upVoteComment(
    data: RouterInputs["comments"]["upVoteComment"]
  ): Promise<CommentRatings>;
}

const commentsDefaultSelect = Prisma.validator<Prisma.CommentSelect>()({
  id: true,
  content: true,
  authorName: true,
  createdAt: true,
  articleId: true,
});

export class CommentsPrismaRepository implements CommentsRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async upVoteComment(
    data: RouterInputs["comments"]["upVoteComment"]
  ): Promise<CommentRatings> {
    return this.prisma.commentRatings.create({
      data: {
        commentId: data.commentId,
        userIp: data.userIp,
        rating: data.rate,
      },
    });
  }

  async createComment(
    data: RouterInputs["comments"]["createNewComment"]
  ): Promise<ArticleComment> {
    return this.prisma.comment.create({
      data: data,
      select: commentsDefaultSelect,
    });
  }
}
