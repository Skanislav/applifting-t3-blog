import { type CommentRatings } from "@prisma/client";
import { observable } from "@trpc/server/observable";
import { EventEmitter } from "events";
import { z } from "zod";

import { type ArticleComment } from "~/lib/models";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export function getCommentsRouter(ee: EventEmitter) {
  return createTRPCRouter({
    onCreate: publicProcedure.subscription(() => {
      return observable<ArticleComment>((emit) => {
        const onAdd = (data: ArticleComment) => {
          emit.next(data);
        };
        ee.on("add", onAdd);
        return () => {
          ee.off("add", onAdd);
        };
      });
    }),

    onUpVote: publicProcedure.subscription(() => {
      return observable<CommentRatings>((emit) => {
        const onUpVote = (data: CommentRatings) => {
          emit.next(data);
        };
        ee.on("newUpVote", onUpVote);
        return () => {
          ee.off("newUpVote", onUpVote);
        };
      });
    }),

    upVoteComment: publicProcedure
      .input(
        z.object({
          commentId: z.string(),
          userIp: z.string(),
          rate: z.enum(["up", "down"]),
        })
      )
      .output(
        z.object({
          success: z.boolean(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const result = await ctx.reps.comments.upVoteComment(input);

        ee.emit("newUpVote", result);
        return { success: true };
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
}

export const commentsRouter = getCommentsRouter(new EventEmitter());
