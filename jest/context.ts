import { type PrismaClient } from "@prisma/client";
import { type DeepMockProxy, mockDeep } from "jest-mock-extended";

import { ArticlesPrismaRepository } from "~/server/repository/prisma/articles-repository";
import { CommentsPrismaRepository } from "~/server/repository/prisma/comments-repository";

import { type Context as AppContext } from "../src/server/context";

export type MockContext = AppContext & {
  prisma: DeepMockProxy<PrismaClient>;
};

export const createMockContext = (): MockContext => {
  const prisma = mockDeep<PrismaClient>();
  return {
    user: null,
    prisma,
    session: null,
    reps: {
      comments: new CommentsPrismaRepository(prisma),
      articles: new ArticlesPrismaRepository(prisma),
    },
  };
};
