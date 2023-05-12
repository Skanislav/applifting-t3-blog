import { api } from "~/utils/api";
import {
  Container,
  Divider,
  Grid,
  Group,
  Space,
  Stack,
  Title,
} from "@mantine/core";
import React from "react";
import { DetailArticle } from "~/lib/components/article/detail-article";
import {
  type GetServerSidePropsContext,
  type InferGetServerSidePropsType,
} from "next";
import { appRouter } from "~/server/api/root";
import { createContext } from "~/server/context";
import superjson from "superjson";
import { createServerSideHelpers } from "@trpc/react-query/server";

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ slug: string }>
) {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: await createContext(context),
    transformer: superjson,
  });
  const slug = context.params?.slug || "";
  await helpers.article.getBySlug.prefetch({ slug });
  return {
    props: {
      trpcState: helpers.dehydrate(),
      slug,
    },
  };
}

export default function ArticleDetailPage({
  slug,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (!slug) return null;

  const article = api.article.getBySlug.useQuery({ slug });

  return (
    <>
      <Container size={"xl"}>
        <Space h={50} />
        <Grid h={"100%"} w={"100%"} columns={3}>
          <Grid.Col span={2}>
            {article.status === "loading" && <div>Loading...</div>}
            {article.status === "error" && (
              <div>Error: {article.error.message}</div>
            )}
            {article.status === "success" && article.data && (
              <DetailArticle article={article.data} />
            )}
          </Grid.Col>
          <Grid.Col span={1}>
            <Group>
              <Divider mah={590} orientation="vertical" />
              <Stack w={346} ml={"auto"}>
                <Title order={3} size={24} weight={500}>
                  Related articles
                </Title>
              </Stack>
            </Group>
          </Grid.Col>
        </Grid>
      </Container>
    </>
  );
}
