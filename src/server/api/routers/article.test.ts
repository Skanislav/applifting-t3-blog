import { createInnerTRPCContext } from "~/server/context";
import { appRouter } from "~/server/api/root";
import { articlesRepository } from "~/server/repository/prisma-repository";

const ctx = createInnerTRPCContext({ session: null });
const caller = appRouter.createCaller({
  ...ctx,
  user: null,
});
const authorizedCaller = appRouter.createCaller({
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

describe("Article API", () => {
  describe("getAll", () => {
    it("should return an array of articles", async () => {
      const result = await caller.article.getAll();
      expect(Array.isArray(result)).toBe(true);
      result.forEach((article) => {
        expect(article).toHaveProperty("id");
        expect(article).toHaveProperty("slug");
        expect(article).toHaveProperty("title");
        expect(article).toHaveProperty("perex");
        expect(article).toHaveProperty("createdAt");
        expect(article).toHaveProperty("publishedAt");
        expect(article).toHaveProperty("author_name");
        expect(article).toHaveProperty("image_url");
      });
    });
  });

  describe("getRelatedArticles", () => {
    it("should return an array of related articles", async () => {
      const slug = "wet-vs-dry-pet-food";
      const caller = appRouter.createCaller({
        ...ctx,
        user: null,
      });

      const result = await caller.article.getRelatedArticles(slug);
      expect(Array.isArray(result)).toBe(true);
      result.forEach((article) => {
        expect(article).toHaveProperty("title");
        expect(article).toHaveProperty("perex");
        expect(article).toHaveProperty("slug");
      });
    });

    it("should throw an error if the article is not found", async () => {
      const slug = "non-existent-slug";
      const caller = appRouter.createCaller({
        ...ctx,
        user: null,
      });
      await expect(caller.article.getRelatedArticles(slug)).rejects.toThrow(
        "Article not found"
      );
    });
  });

  describe("createNewArticle", () => {
    it("should create a new article", async () => {
      const input = {
        title: "New Article for test",
        content: "Lorem ipsum dolor sit amet",
        image: "image-url.jpg",
        slug: "new-article-for-test",
      };
      const result = await authorizedCaller.article.createNewArticle(input);
      expect(result).toEqual({});
      await articlesRepository.deleteArticle(input.slug);
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

  /*
    🥷 Before proceeding here we need to solve test database setup.
     */
  // describe('editArticle', () => {
  //     it('should edit an existing article', async () => {
  //         const input = {
  //             title: 'Updated Article',
  //             content: 'Updated content',
  //             image: 'updated-image-url.jpg',
  //             slug: 'example-slug',
  //         };
  //         await authorizedCaller.article.createNewArticle(input);
  //
  //         const result = await authorizedCaller.article.editArticle({...input, title: 'Updated Article 2'});
  //         expect(result).toEqual({});
  //         expect(await articlesRepository.getBySlug(input.slug)).toHaveProperty('title', 'Updated Article 2');
  //         await articlesRepository.deleteArticle(input.slug);
  //     });
  //
  //     it('should throw an error if the article is not found', async () => {
  //         const input = {
  //             title: 'Non-existent Article',
  //             content: 'Updated content',
  //             image: 'updated-image-url.jpg',
  //             slug: 'non-existent-slug',
  //         };
  //         await expect(caller.article.editArticle(input)).rejects.toThrow(
  //             'Article not found'
  //         );
  //     });
  // });
});
