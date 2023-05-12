import {createTRPCRouter, publicProcedure} from "~/server/api/trpc";
import {articlesRepository} from "~/server/repository/prisma-repository";
import {z} from "zod";
import {type Article} from "@prisma/client";

export const articleRouter = createTRPCRouter({

    getAll: publicProcedure.meta({
        openapi: {
            method: 'GET',
            path: '/articles',
            tags: ['articles'],
            summary: 'List recent articles ordered by descending date',
        },
    })
        .input(z.undefined())
        .output(
            z.object({
                id: z.string(),
                slug: z.string(),
                title: z.string(),
                perex: z.string(),
                content: z.string(),
                createdAt: z.date(),
                publishedAt: z.date().nullable(),
                author_name: z.string(),
                image_url: z.string().nullable(),
            }).array(),
        ).query((): Promise<Article[]> => {
            return articlesRepository.getArticles();
        }),
});
