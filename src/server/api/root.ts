import { createTRPCRouter } from "~/server/api/trpc";
import { articleRouter } from "~/server/api/routers/article";

export const appRouter = createTRPCRouter({
  article: articleRouter,
});

export type AppRouter = typeof appRouter;
