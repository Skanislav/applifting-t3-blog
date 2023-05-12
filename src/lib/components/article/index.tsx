import React from "react";
import {
  Box,
  Flex,
  Group,
  Space,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { type Article } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

type ArticlePreviewProps = {
  article: Article;
} & React.PropsWithChildren;

function formatDate(date: Date) {
  return date.toLocaleString("en-GB", { timeZone: "UTC" }).split(",")[0];
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
        <Text size={16} weight={400} color={"dark"}>
          {article?.perex}
        </Text>
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
            4 comments
          </Text>
        </Group>
      </Stack>
    </Flex>
  );
};
