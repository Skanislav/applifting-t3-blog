import {
  Divider,
  Stack,
  Text,
  Title,
  TypographyStylesProvider,
} from "@mantine/core";
import Image from "next/image";
import React from "react";

import { formatDate } from "~/lib/format";
import { type RouterOutputs } from "~/utils/api";

export const DetailArticle = ({
  article,
}: {
  article: RouterOutputs["article"]["getBySlug"];
}) => {
  return (
    <Stack>
      <Title order={1} sx={{ fontSize: 40, fontWeight: 500 }} color={"dark"}>
        {article?.title}
      </Title>
      <Text size={14} weight={400} color={"#6C757D"}>
        {article?.author_name} {formatDate(article?.createdAt)}
      </Text>

      <Image
        src={article.image_url || ""}
        width={760}
        height={504}
        alt={"Article main image"}
      />

      <TypographyStylesProvider>
        <div
          style={{
            fontWeight: 400,
            fontSize: 20,
            color: "#212529",
            fontFamily: "inherit",
          }}
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </TypographyStylesProvider>

      <Divider />
    </Stack>
  );
};
