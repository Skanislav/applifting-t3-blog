import { Space, Text, Title } from "@mantine/core";
import { Stack } from "@mantine/core";
import Link from "next/link";
import React from "react";

import { api } from "~/utils/api";

type RelatedArticlesProps = {
  articleSlug: string;
};

export function RelatedArticles({ articleSlug }: RelatedArticlesProps) {
  const articles = api.article.getRelatedArticles.useQuery({
    slug: articleSlug,
  });

  return (
    <Stack>
      <Title order={3} size={24} weight={500}>
        Related articles
      </Title>

      <Space h={"s"} />

      {articles.data?.map((article) => (
        <Link key={article.slug} href={`/article/${article.slug}`}>
          <Text weight={500} mb={"m"} size={16}>
            {article.title}
          </Text>
          <Text weight={400} size={14}>
            {article.perex}
          </Text>
        </Link>
      ))}
    </Stack>
  );
}
