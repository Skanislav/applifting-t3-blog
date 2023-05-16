import { articleRouter } from "~/server/api/routers/article";
import { commentsRouter } from "~/server/api/routers/comments";
import { createTRPCRouter } from "~/server/api/trpc";

export const appRouter = createTRPCRouter({
  article: articleRouter,
  comments: commentsRouter,
});

export type AppRouter = typeof appRouter;
