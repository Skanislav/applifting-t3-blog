import { type Article } from "@prisma/client";
import { type Comment } from "@prisma/client";

export type ArticleListEntity = Omit<Article, "content" | "publishedAt"> & {
  countComments: number;
};
export type ArticleComment = Omit<Comment, "articleId">;
export type ArticleDetailEntity = Omit<Article, "perex" | "publishedAt"> & {
  comments: ArticleComment[];
};
