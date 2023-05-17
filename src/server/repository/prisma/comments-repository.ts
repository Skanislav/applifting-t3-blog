import { Prisma, type PrismaClient } from "@prisma/client";

import { type ArticleComment } from "~/lib/models";
import { type RouterInputs } from "~/utils/api";

export interface CommentsRepository {
  createComment(
    data: RouterInputs["comments"]["createNewComment"]
  ): Promise<ArticleComment>;
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

  async createComment(
    data: RouterInputs["comments"]["createNewComment"]
  ): Promise<ArticleComment> {
    return this.prisma.comment.create({
      data: data,
      select: commentsDefaultSelect,
    });
  }
}
