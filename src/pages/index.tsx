import { Center, Container, Space, Stack, Title } from "@mantine/core";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { type GetServerSidePropsContext, type NextPage } from "next";
import React from "react";
import superjson from "superjson";

import { ArticlePreview } from "~/components/article";
import { appRouter } from "~/server/api/root";
import { createContext } from "~/server/context";
import { api } from "~/utils/api";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: await createContext(context),
    transformer: superjson,
  });
  await helpers.article.getAll.prefetch();
  return {
    props: {
      trpcState: helpers.dehydrate(),
    },
  };
}

const Home: NextPage = () => {
  const { data: articles } = api.article.getAll.useQuery();
  return (
    <Center>
      <Container>
        <Title order={1} sx={{ fontSize: 40, fontWeight: 500 }} color={"dark"}>
          Recent articles
        </Title>
        <Space h={60} />
        <Stack sx={{ gap: 32 }}>
          {articles?.map((article) => (
            <ArticlePreview key={article?.slug} article={article} />
          ))}
        </Stack>
      </Container>
    </Center>
  );
};

export default Home;
