import { type Article } from "@prisma/client";

import { appRouter } from "~/server/api/root";
import { type Context } from "~/server/context";

import articlesData from "../../../../assets/articles.json";
import { createMockContext, type MockContext } from "../../../../jest/context";

let mockCtx: MockContext;
let ctx: Context;
let caller: ReturnType<typeof appRouter.createCaller>;
let authorizedCaller: ReturnType<typeof appRouter.createCaller>;

const mockArticles = articlesData.map(
  ({ image_url, ...article }) =>
    ({
      ...article,
      image_url: "",
      publishedAt: null,
      createdAt: new Date(article.createdAt),
      _count: { comments: 0 },
      comments: [],
    } as unknown as Article)
);

beforeEach(() => {
  mockCtx = createMockContext();
  ctx = mockCtx as unknown as Context;
  caller = appRouter.createCaller({
    ...ctx,
    user: null,
  });
  authorizedCaller = appRouter.createCaller({
    ...ctx,
    session: {
      expires: "2025-08-01T00:00:00.000Z",
      user: {
        id: "test-id",
        name: "admin",
      },
    },
    user: {
      id: "test-id",
      name: "admin",
    },
  });
});

describe("Article API", () => {
  describe("getAll", () => {
    it("should return an array of articles", async () => {
      mockCtx.prisma.article.findMany.mockResolvedValueOnce(mockArticles);

      const result = await caller.article.getAll();
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(mockArticles.length);
      result.forEach((article) => {
        expect(article).toHaveProperty("id");
        expect(article).toHaveProperty("slug");
        expect(article).toHaveProperty("title");
        expect(article).toHaveProperty("perex");
        expect(article).toHaveProperty("createdAt");
        expect(article).toHaveProperty("author_name");
        expect(article).toHaveProperty("image_url");
        expect(article).toHaveProperty("countComments");
      });
    });
  });

  describe("getRelatedArticles", () => {
    it("should return an array of related articles", async () => {
      mockCtx.prisma.article.findMany.mockResolvedValueOnce(mockArticles);
      const slug = "wet-vs-dry-pet-food";
      const caller = appRouter.createCaller({
        ...ctx,
        user: null,
      });

      const result = await caller.article.getRelatedArticles({ slug });
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(2);
      result.forEach((article) => {
        expect(article).toHaveProperty("title");
        expect(article).toHaveProperty("perex");
        expect(article).toHaveProperty("slug");
        expect(article).not.toHaveProperty("content");
      });
    });

    it("should throw an error if the article is not found", async () => {
      mockCtx.prisma.article.findMany.mockResolvedValueOnce([]);
      const slug = "non-existent-slug-1";
      const caller = appRouter.createCaller({
        ...ctx,
        user: null,
      });
      const result = await caller.article.getRelatedArticles({ slug });
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(0);
    });
  });

  describe("createNewArticle", () => {
    it("should create a new article", async () => {
      const input = {
        title: "testing",
        content: "Lorem ipsum dolor sit amet",
        image: "image-url.jpg",
      };
      const article = mockArticles[0] as unknown as Article;
      mockCtx.prisma.article.findUnique.mockResolvedValueOnce(null);
      mockCtx.prisma.article.create.mockResolvedValueOnce(article);
      const result = await authorizedCaller.article.createNewArticle(input);
      expect(result).toEqual({});
    });

    it("should throw an error if unauthorized", async () => {
      const input = {
        title: "Unauthorized Article",
        content: "Lorem ipsum dolor sit amet",
        image: "image-url.jpg",
      };
      await expect(caller.article.createNewArticle(input)).rejects.toThrow(
        "UNAUTHORIZED"
      );
    });
  });

  describe("getArticleBySlug", () => {
    it("should return an article by slug", async () => {
      const article = mockArticles[0] as unknown as Article;
      mockCtx.prisma.article.findUnique.mockResolvedValueOnce(article);

      const result = await caller.article.getBySlug({ slug: article.slug });
      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("slug");
      expect(result).toHaveProperty("title");
      expect(result).toHaveProperty("content");
      expect(result).toHaveProperty("createdAt");
      expect(result).toHaveProperty("author_name");
      expect(result).toHaveProperty("image_url");
      expect(result).toHaveProperty("comments");
    });
  });

  it("should throw an error if the article is not found", async () => {
    mockCtx.prisma.article.findUnique.mockResolvedValueOnce(null);
    const slug = "non-existent-slug-2";
    await expect(caller.article.getBySlug({ slug })).rejects.toThrow(
      "Article not found"
    );
  });
});

describe("editArticle", () => {
  it("should edit an existing article", async () => {
    const mockArticle = mockArticles[0] as unknown as Article;
    mockCtx.prisma.article.findUnique.mockResolvedValueOnce(mockArticle);
    mockCtx.prisma.article.update.mockResolvedValueOnce(mockArticle);

    const input = {
      title: "Updated Article",
      content: "Updated content",
      image: "updated-image-url.jpg",
      slug: "example-slug",
    };

    const result = await authorizedCaller.article.editArticle({
      ...input,
      title: "Updated Article 2",
    });
    expect(result).toEqual({});
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockCtx.prisma.article.update).toHaveBeenCalledWith({
      data: {
        content: input.content,
        image_url: input.image,
        title: "Updated Article 2",
      },
      where: {
        slug: mockArticle.slug,
      },
    });
  });

  it("should throw an error if not authorized", async () => {
    mockCtx.prisma.article.findUnique.mockResolvedValueOnce(null);
    const input = {
      title: "Non-existent Article",
      content: "Updated content",
      image: "updated-image-url.jpg",
      slug: "non-existent-slug",
    };
    await expect(caller.article.editArticle(input)).rejects.toThrow(
      "UNAUTHORIZED"
    );
  });

  it("should throw an error if the article is not found", async () => {
    mockCtx.prisma.article.findUnique.mockResolvedValueOnce(null);
    const input = {
      title: "Non-existent Article",
      content: "Updated content",
      image: "updated-image-url.jpg",
      slug: "non-existent-slug",
    };
    await expect(authorizedCaller.article.editArticle(input)).rejects.toThrow(
      "Article not found"
    );
  });
});

describe("deleteArticle", () => {
  it("should delete if article exists", async () => {
    const article = mockArticles[0] as unknown as Article;
    mockCtx.prisma.article.findUnique.mockResolvedValueOnce(article);
    mockCtx.prisma.article.delete.mockResolvedValueOnce(article);

    const input = {
      slug: "example-slug",
    };

    const result = await authorizedCaller.article.deleteArticle(input);

    expect(result).toBeUndefined();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockCtx.prisma.article.delete).toHaveBeenCalledWith({
      where: {
        slug: input.slug,
      },
    });
  });

  it("should throw an error if not authorized", async () => {
    mockCtx.prisma.article.delete.mockImplementation();
    const input = {
      slug: "non-existent-slug",
    };
    await expect(caller.article.deleteArticle(input)).rejects.toThrow(
      "UNAUTHORIZED"
    );
  });

  it("should throw an error if not found", async () => {
    mockCtx.prisma.article.delete.mockRejectedValue(new Error("Not found"));
    const input = {
      slug: "non-existent-slug",
    };
    await expect(authorizedCaller.article.deleteArticle(input)).rejects.toThrow(
      "Article not found"
    );
  });
});
