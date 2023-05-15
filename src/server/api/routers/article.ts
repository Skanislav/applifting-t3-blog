import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { articlesRepository } from "~/server/repository/prisma-repository";
import { z } from "zod";
import { type Article } from "@prisma/client";

export const articleRouter = createTRPCRouter({
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
          publishedAt: z.date().nullable(),
          author_name: z.string(),
          image_url: z.string().nullable(),
        })
        .array()
    )
    .query((): Promise<Article[]> => {
      return articlesRepository.getArticles();
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
    .input(z.string().describe("Article slug"))
    .output(
      z
        .object({
          title: z.string(),
          perex: z.string(),
          slug: z.string(),
        })
        .array()
    )
    .query(async ({ input }): Promise<Article[]> => {
      const article = await articlesRepository.getBySlug(input);
      return articlesRepository.getRelatedArticles(article);
    }),

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

      return articlesRepository.createArticle(
        title,
        content,
        image,
        ctx.user.id
      );
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
        publishedAt: z.date().nullable(),
        author_name: z.string(),
        image_url: z.string().nullable(),
      })
    )
    .query(async (ctx): Promise<Article> => {
      const {
        input: { slug },
      } = ctx;
      return articlesRepository.getBySlug(slug);
    }),
});
