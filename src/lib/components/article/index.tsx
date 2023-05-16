import React from "react";
import {
  Box,
  Flex,
  Group,
  Space,
  Stack,
  Text,
  TypographyStylesProvider,
  UnstyledButton,
} from "@mantine/core";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "~/lib/format";
import { type ArticleListEntity } from "~/lib/models";

type ArticlePreviewProps = {
  article: ArticleListEntity;
};

function isHtml(input: string) {
  return /<[a-z]+\d?(\s+[\w-]+=("[^"]*"|'[^']*'))*\s*\/?>|&#?\w+;/i.test(input);
}
export const ArticlePreview = ({ article }: ArticlePreviewProps) => {
  return (
    <Flex gap={24}>
      {article.image_url && (
        <Image
          width={272}
          height={244}
          src={article.image_url}
          alt={"article-image"}
        />
      )}
      <Stack w={557}>
        <Text weight={500} size={24} color={"dark"}>
          {article?.title}
        </Text>
        <Text size={14} color={"#6C757D"} weight={400}>
          {article?.author_name} {formatDate(article?.createdAt)}
        </Text>
        {isHtml(article?.perex) ? (
          <TypographyStylesProvider>
            <span
              style={{
                fontWeight: 400,
                fontSize: 16,
                color: "dark",
                fontFamily: "inherit",
              }}
              dangerouslySetInnerHTML={{ __html: article.perex }}
            />
          </TypographyStylesProvider>
        ) : (
          <Text size={16} weight={400} color={"dark"}>
            {article?.perex}
          </Text>
        )}
        <Space h={"m"} />
        <Group>
          <Box ml={5}>
            <UnstyledButton component={Link} href={"/article/" + article.slug}>
              <Text color={"#007BFF"} weight={400} size={14}>
                Read whole article
              </Text>
            </UnstyledButton>
          </Box>
          <Text size={14} weight={400} color={"#6C757D"}>
            {article.countComments} comments
          </Text>
        </Group>
      </Stack>
    </Flex>
  );
};
