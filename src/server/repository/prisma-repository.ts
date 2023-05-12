import { type Article } from "@prisma/client";
import { prisma } from "~/server/db";

export interface ArticlesRepository {
  getArticles: () => Promise<Article[]>;
  getBySlug: (slug: string) => Promise<Article>;
}

class PrismaArticlesRepository implements ArticlesRepository {
  async getArticles(): Promise<Article[]> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    const articles = await prisma.article.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    if (articles?.length) {
      return Promise.resolve(articles);
    }

    return [];
  }

  async getBySlug(slug: string): Promise<Article> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    const article = (await prisma.article.findUnique({
      where: {
        slug,
      },
    })) as Article;

    if (article) {
      return Promise.resolve(article);
    }

    return Promise.reject(new Error("Article not found"));
  }
}

export const articlesRepository: ArticlesRepository =
  new PrismaArticlesRepository();
