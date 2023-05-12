import {type Article} from "@prisma/client";
import {prisma} from "~/server/db";

export interface ArticlesRepository {
    getArticles: () => Promise<Article[]>;
}

class PrismaArticlesRepository implements ArticlesRepository {
    async getArticles(): Promise<Article[]> {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
        const articles = await prisma.article.findMany({
            orderBy: {
                createdAt: "desc",
            }
        }) as Article[];

        if (articles?.length) {
            return Promise.resolve(articles);
        }

        return [];
    }
}

export const articlesRepository: ArticlesRepository = new PrismaArticlesRepository();
