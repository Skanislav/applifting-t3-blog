import type * as trpc from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { type NodeHTTPCreateContextFnOptions } from "@trpc/server/src/adapters/node-http";
import { type IncomingMessage } from "http";
import { type GetServerSidePropsContext } from "next";
import { type Session } from "next-auth";
import { getToken } from "next-auth/jwt";
import { getSession } from "next-auth/react";
import type ws from "ws";

import { prisma } from "~/server/db";
import {
  ArticlesPrismaRepository,
  type ArticlesRepository,
} from "~/server/repository/prisma/articles-repository";
import {
  CommentsPrismaRepository,
  type CommentsRepository,
} from "~/server/repository/prisma/comments-repository";

type CreateContextOptions = {
  session: Session | null;
};

export const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    prisma: prisma,
    reps: {
      comments: new CommentsPrismaRepository(prisma),
      articles: new ArticlesPrismaRepository(prisma),
    },
  };
};

export const createContext = async (
  opts:
    | GetServerSidePropsContext
    | CreateNextContextOptions
    | NodeHTTPCreateContextFnOptions<IncomingMessage, ws>
) => {
  const session = await getSession({ req: opts.req });
  const token = await getToken(opts);

  const ctx = createInnerTRPCContext({
    session,
  });

  return {
    ...ctx,
    user: token,
  };
};

export type AppContext = trpc.inferAsyncReturnType<typeof createContext> & {
  reps: {
    comments: CommentsRepository;
    articles: ArticlesRepository;
  };
};

export type Context = AppContext;
