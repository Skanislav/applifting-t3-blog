import {prisma} from "~/server/db";
import articlesData from '../assets/articles.json'

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
        data: articlesData
    })
}

async function main() {
    await seedAdmin();
    await seedArticles();
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