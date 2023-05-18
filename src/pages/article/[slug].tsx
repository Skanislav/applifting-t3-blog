import { Container, Divider, Grid, Group, Space, Stack } from "@mantine/core";
import { createServerSideHelpers } from "@trpc/react-query/server";
import {
  type GetServerSidePropsContext,
  type InferGetServerSidePropsType,
} from "next";
import React from "react";
import superjson from "superjson";

import { DetailArticle } from "~/components/article/detail-article";
import { ArticleComments } from "~/components/comments/comments-list";
import { RelatedArticles } from "~/components/related-articles";
import { appRouter } from "~/server/api/root";
import { createContext } from "~/server/context";
import { api } from "~/utils/api";
import { getRequestIpAddress } from "~/utils/get-request-ip-address";

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ slug: string }>
) {
  const userIp = getRequestIpAddress(context.req);
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
      userIp,
    },
  };
}

export default function ArticleDetailPage({
  slug,
  userIp,
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
              <>
                <DetailArticle article={article.data} />
                <Space h={20} />
                <ArticleComments
                  userIp={userIp}
                  articleId={article.data.id}
                  comments={article.data.comments || []}
                />
              </>
            )}
          </Grid.Col>
          <Grid.Col span={1}>
            <Group>
              <Divider mah={590} orientation="vertical" />
              <Stack w={346} ml={"auto"}>
                <RelatedArticles articleSlug={slug} />
              </Stack>
            </Group>
          </Grid.Col>
        </Grid>
      </Container>
    </>
  );
}
