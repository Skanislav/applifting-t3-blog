import { createTRPCRouter } from "~/server/api/trpc";
import { articleRouter } from "~/server/api/routers/article";
import { commentsRouter } from "~/server/api/routers/comments";

export const appRouter = createTRPCRouter({
  article: articleRouter,
  comments: commentsRouter,
});

export type AppRouter = typeof appRouter;
