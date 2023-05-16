import { prisma } from "~/server/db";
import articlesData from "../assets/articles.json";
import commentsData from "../assets/comments.json";

async function seedAdmin() {
  const id = "test-id";
  await prisma.user.upsert({
    create: {
      id,
      name: "admin",
      password: "admin",
    },
    where: {
      id,
    },
    update: {},
  });
}

async function seedArticles() {
  await prisma.article.createMany({
    data: articlesData,
  });
}

async function seedComments() {
  await prisma.comment.createMany({
    data: commentsData,
  });
}

async function main() {
  await seedAdmin();
  await seedArticles();
  await seedComments();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
