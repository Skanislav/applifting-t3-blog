import { type Article, Prisma, type PrismaClient } from "@prisma/client";

import { type ArticleDetailEntity, type ArticleListEntity } from "~/lib/models";

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
  comments: {
    select: {
      id: true,
      content: true,
      authorName: true,
      createdAt: true,
      CommentRatings: {
        select: {
          rating: true,
        },
      },
      _count: {
        select: {
          CommentRatings: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  },
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
  getRelatedArticles: (
    articleSlug: Pick<Article, "slug">
  ) => Promise<Article[]>;
  editArticle: (article: Partial<Article>) => Promise<Article>;
}

export class ArticlesPrismaRepository implements ArticlesRepository {
  constructor(private prisma: PrismaClient) {}

  deleteArticle(slug: string): Promise<boolean> {
    return this.prisma.article
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
    return this.prisma.article.update({
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
    const articles = await this.prisma.article.findMany({
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
    const article = await this.prisma.article.findUnique({
      select: articleDetailValidator,
      where: {
        slug,
      },
    });

    if (article) {
      const { comments, ...restProps } = article;
      const commentsWithCount = comments.map(({ CommentRatings, ...rest }) => {
        let sum = 0;
        Object.values(CommentRatings).forEach(({ rating }) => {
          rating === "up" ? sum++ : sum--;
        });
        return { ...rest, countRatings: sum };
      });
      return Promise.resolve({ ...restProps, comments: commentsWithCount });
    }

    return Promise.reject(new Error("Article not found"));
  }

  async createArticle(
    title: string,
    content: string,
    image_url: string,
    author_name: string
  ): Promise<Article> {
    const created = await this.prisma.article.create({
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

  async getRelatedArticles({ slug }: { slug: string }): Promise<Article[]> {
    const articles = await this.prisma.article.findMany({
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
