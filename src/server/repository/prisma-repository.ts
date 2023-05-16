import { type Article, Prisma } from "@prisma/client";

import { type ArticleDetailEntity, type ArticleListEntity } from "~/lib/models";
import { prisma } from "~/server/db";

const articleListEntityValidator = Prisma.validator<Prisma.ArticleSelect>()({
  id: true,
  title: true,
  slug: true,
  perex: true,
  image_url: true,
  author_name: true,
  createdAt: true,
  _count: {
    select: {
      comments: true,
    },
  },
});

const articleDetailValidator = Prisma.validator<Prisma.ArticleSelect>()({
  id: true,
  title: true,
  slug: true,
  content: true,
  image_url: true,
  author_name: true,
  createdAt: true,
  comments: true,
});

export interface ArticlesRepository {
  getArticles: () => Promise<ArticleListEntity[]>;
  getBySlug: (slug: string) => Promise<ArticleDetailEntity>;
  deleteArticle: (slug: string) => Promise<boolean>;
  createArticle: (
    title: string,
    content: string,
    image: string,
    user_id: string
  ) => Promise<Article>;
  getRelatedArticles: (articleSlug: Article["slug"]) => Promise<Article[]>;
  editArticle: (article: Partial<Article>) => Promise<Article>;
}

class PrismaArticlesRepository implements ArticlesRepository {
  deleteArticle(slug: string): Promise<boolean> {
    return prisma.article
      .delete({
        where: {
          slug,
        },
      })
      .then(() => true)
      .catch(() => false);
  }

  editArticle(article: Partial<Article>): Promise<Article> {
    const { title, content, image_url, slug } = article;
    return prisma.article.update({
      where: {
        slug,
      },
      data: {
        title,
        content,
        image_url,
      },
    });
  }

  async getArticles(): Promise<ArticleListEntity[]> {
    const articles = await prisma.article.findMany({
      select: articleListEntityValidator,
      orderBy: {
        createdAt: "desc",
      },
    });

    if (articles?.length) {
      return Promise.resolve(
        articles.map(({ _count: { comments }, ...article }) => ({
          ...article,
          countComments: comments,
        }))
      );
    }

    return [];
  }

  async getBySlug(slug: string): Promise<ArticleDetailEntity> {
    const article = await prisma.article.findUnique({
      select: articleDetailValidator,
      where: {
        slug,
      },
    });

    if (article) {
      return Promise.resolve(article);
    }

    return Promise.reject(new Error("Article not found"));
  }

  async createArticle(
    title: string,
    content: string,
    image_url: string,
    author_name: string
  ): Promise<Article> {
    const created = await prisma.article.create({
      data: {
        title,
        content,
        image_url,
        author_name,
        slug: title.toLowerCase().replace(/ /g, "-"),
        perex: content.substring(0, 100),
      },
    });

    if (created) {
      return Promise.resolve(created);
    }

    return Promise.reject(new Error("Article not created"));
  }

  async getRelatedArticles(slug: string): Promise<Article[]> {
    const articles = await prisma.article.findMany({
      where: {
        slug,
      },
    });
    if (articles?.length) {
      return Promise.resolve(articles);
    }

    return Promise.resolve([]);
  }
}

export const articlesRepository = new PrismaArticlesRepository();
