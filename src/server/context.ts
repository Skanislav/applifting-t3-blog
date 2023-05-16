import type * as trpc from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { type GetServerSidePropsContext } from "next";
import { type Session } from "next-auth";
import { getToken } from "next-auth/jwt";
import { getSession } from "next-auth/react";

import { prisma } from "~/server/db";
import { CommentsPrismaRepository } from "~/server/repository/comments-repository";

type CreateContextOptions = {
  session: Session | null;
};

export const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    prisma: prisma,
    reps: {
      comments: new CommentsPrismaRepository(prisma),
    },
  };
};

export const createContext = async (
  opts: GetServerSidePropsContext | CreateNextContextOptions
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

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
