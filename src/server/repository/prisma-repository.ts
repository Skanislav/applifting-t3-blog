import { type Article } from "@prisma/client";
import { prisma } from "~/server/db";

export interface ArticlesRepository {
  getArticles: () => Promise<Article[]>;
  getBySlug: (slug: string) => Promise<Article>;
  createArticle: (
    title: string,
    content: string,
    image: string,
    user_id: string
  ) => Promise<Article>;
  getRelatedArticles: (article: Article) => Promise<Article[]>;
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

  async getRelatedArticles(article: Article): Promise<Article[]> {
    const articles = await prisma.article.findMany({
      where: {
        author_name: article.author_name,
      },
    });
    if (articles?.length) {
      return Promise.resolve(articles);
    }

    return Promise.resolve([]);
  }
}

export const articlesRepository: ArticlesRepository =
  new PrismaArticlesRepository();
