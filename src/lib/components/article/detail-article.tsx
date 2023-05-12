import Image from "next/image";
import { type RouterOutputs } from "~/utils/api";
import {
  Stack,
  Title,
  Text,
  TypographyStylesProvider,
  Divider,
} from "@mantine/core";
import React from "react";

function formatDate(date: Date) {
  return date.toLocaleString("en-GB", { timeZone: "UTC" }).split(",")[0];
}

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
