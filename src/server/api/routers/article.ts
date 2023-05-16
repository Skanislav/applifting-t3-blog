import { type Article } from "@prisma/client";
import { z } from "zod";

import { type ArticleDetailEntity, type ArticleListEntity } from "~/lib/models";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { articlesRepository } from "~/server/repository/prisma-repository";

export const articleRouter = createTRPCRouter({
  createNewArticle: protectedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/articles",
        tags: ["articles"],
        summary: "Create new article",
        protect: true,
      },
    })
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        image: z.string(),
      })
    )
    .output(z.object({}))
    .mutation(async ({ ctx, input }) => {
      const { title, content, image } = input;
      const {
        user: { name: username },
      } = ctx;

      /**
       * already handled by zod
       */
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return articlesRepository.createArticle(title, content, image, username!);
    }),

  deleteArticle: protectedProcedure
    .meta({
      openapi: {
        method: "DELETE",
        path: "/articles/:slug",
        tags: ["articles"],
        summary: "Delete article",
        protect: true,
      },
    })
    .input(
      z.object({
        slug: z.string(),
      })
    )
    .output(z.void())
    .mutation(async ({ input }) => {
      const { slug } = input;
      const isDeleted = await articlesRepository.deleteArticle(slug);

      if (!isDeleted) {
        throw new Error("Article not found");
      }

      return;
    }),

  editArticle: protectedProcedure
    .meta({
      openapi: {
        method: "PUT",
        path: "/articles/:slug",
        tags: ["articles"],
        summary: "Edit article",
        protect: true,
      },
    })
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        image: z.string(),
        slug: z.string(),
      })
    )
    .output(z.object({}))
    .mutation(async ({ input }) => {
      const { title, content, image, slug } = input;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const article = await articlesRepository.getBySlug(slug);

      // We could use something like this in the future
      // if (article.author_id !== ctx.user.id) {
      //
      // }

      if (!article) {
        throw new Error("Article not found");
      }

      return articlesRepository.editArticle({
        ...article,
        content,
        title,
        image_url: image,
      });
    }),

  getAll: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/articles",
        tags: ["articles"],
        summary: "List recent articles ordered by descending date",
      },
    })
    .input(z.void())
    .output(
      z
        .object({
          id: z.string(),
          slug: z.string(),
          title: z.string(),
          perex: z.string(),
          createdAt: z.date(),
          author_name: z.string(),
          image_url: z.string().nullable(),
          countComments: z.number(),
        })
        .array()
    )
    .query(async (): Promise<ArticleListEntity[]> => {
      return await articlesRepository.getArticles();
    }),

  getBySlug: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/article/:slug",
        tags: ["articles"],
        summary: "List recent articles ordered by descending date",
      },
    })
    .input(
      z.object({
        slug: z.string(),
      })
    )
    .output(
      z.object({
        id: z.string(),
        slug: z.string(),
        title: z.string(),
        content: z.string(),
        createdAt: z.date(),
        author_name: z.string(),
        image_url: z.string().nullable(),
        comments: z
          .object({
            id: z.string(),
            content: z.string(),
            createdAt: z.date(),
            authorName: z.string(),
          })
          .array(),
      })
    )
    .query(async (ctx): Promise<ArticleDetailEntity> => {
      const {
        input: { slug },
      } = ctx;
      return articlesRepository.getBySlug(slug);
    }),

  getRelatedArticles: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/articles/:slug/related",
        tags: ["articles"],
        summary: "List recent articles ordered by descending date",
      },
    })
    .input(z.object({ slug: z.string() }))
    .output(
      z
        .object({
          title: z.string(),
          perex: z.string(),
          slug: z.string(),
        })
        .array()
    )
    .query(async ({ input: { slug } }): Promise<Article[]> => {
      return articlesRepository.getRelatedArticles({ slug });
    }),
});
