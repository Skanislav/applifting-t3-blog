import { type GetServerSidePropsContext } from "next";
import { type Session } from "next-auth";
import { prisma } from "~/server/db";

type CreateContextOptions = {
  session: Session | null;
};

const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    prisma: prisma,
  };
};

import type * as trpc from "@trpc/server";
import type * as trpcNext from "@trpc/server/adapters/next";
import { type NodeHTTPCreateContextFnOptions } from "@trpc/server/adapters/node-http";
import { type IncomingMessage } from "http";
import { getSession } from "next-auth/react";
import type ws from "ws";

export const createContext = async (
  opts:
    | trpcNext.CreateNextContextOptions
    | NodeHTTPCreateContextFnOptions<IncomingMessage, ws>
    | GetServerSidePropsContext
) => {
  const session = await getSession(opts);

  return createInnerTRPCContext({
    session,
  });
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
