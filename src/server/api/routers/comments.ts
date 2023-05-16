import { observable } from "@trpc/server/observable";
import { EventEmitter } from "events";
import { z } from "zod";

import { type ArticleComment } from "~/lib/models";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const ee = new EventEmitter();

export const commentsRouter = createTRPCRouter({
  onCreate: publicProcedure.subscription(() => {
    return observable<Comment>((emit) => {
      const onAdd = (data: Comment) => {
        // emit data to client
        emit.next(data);
      };
      // trigger `onAdd()` when `add` is triggered in our event emitter
      ee.on("add", onAdd);
      // unsubscribe function when client disconnects or stops subscribing
      return () => {
        ee.off("add", onAdd);
      };
    });
  }),

  createNewComment: publicProcedure
    .input(
      z.object({
        content: z.string(),
        authorName: z.string(),
        articleId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }): Promise<ArticleComment> => {
      const {
        reps: { comments: commentsRepository },
      } = ctx;

      const comment = await commentsRepository.createComment({
        content: input.content,
        authorName: input.authorName,
        articleId: input.articleId,
      });

      ee.emit("add", comment);
      return comment;
    }),
});
