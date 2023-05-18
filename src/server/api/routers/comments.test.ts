import { type Comment } from "@prisma/client";
import { type EventEmitter } from "events";

import { appRouter } from "~/server/api/root";
import { getCommentsRouter } from "~/server/api/routers/comments";
import { createTRPCRouter } from "~/server/api/trpc";
import { type Context } from "~/server/context";

import commentsData from "../../../../assets/comments.json";
import { createMockContext, type MockContext } from "../../../../jest/context";

const eeMock = {
  on: jest.fn(),
  off: jest.fn(),
  emit: jest.fn(),
};
const mockedCommentsRouter = createTRPCRouter({
  comments: getCommentsRouter(eeMock as unknown as EventEmitter),
  article: appRouter.article,
});

let mockCtx: MockContext;
let ctx: Context;
let caller: ReturnType<typeof appRouter.createCaller>;
let mockedWsCaller: ReturnType<typeof appRouter.createCaller>;

beforeEach(() => {
  mockCtx = createMockContext();
  ctx = mockCtx as unknown as Context;
  caller = appRouter.createCaller({
    ...ctx,
    user: null,
  });
  mockedWsCaller = mockedCommentsRouter.createCaller({
    ...ctx,
    user: null,
  });
});

describe("Comments Router", () => {
  it("should create new comment", async () => {
    const input = {
      content: "test content",
      authorName: "test author",
      articleId: "test article id",
    };
    const comment = commentsData[0] as unknown as Comment;
    mockCtx.prisma.comment.create.mockResolvedValueOnce(comment);

    const result = await caller.comments.createNewComment(input);
    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("content", comment.content);
    expect(result).toHaveProperty("authorName", comment.authorName);
  });

  it("should emit new comment", async () => {
    const input = {
      content: "test content",
      authorName: "test author",
      articleId: "test article id",
    };
    const comment = commentsData[0] as unknown as Comment;
    mockCtx.prisma.comment.create.mockResolvedValueOnce(comment);

    const result = await mockedWsCaller.comments.createNewComment(input);
    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("content", comment.content);
    expect(result).toHaveProperty("authorName", comment.authorName);

    expect(eeMock.emit).toBeCalledWith("add", result);
  });
});
