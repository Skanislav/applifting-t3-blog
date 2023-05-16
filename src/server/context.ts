import { type Session } from "next-auth";
import { prisma } from "~/server/db";
import type * as trpc from "@trpc/server";
import { getSession } from "next-auth/react";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { getToken } from "next-auth/jwt";
import { type GetServerSidePropsContext } from "next";

type CreateContextOptions = {
  session: Session | null;
};

export const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    prisma: prisma,
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
