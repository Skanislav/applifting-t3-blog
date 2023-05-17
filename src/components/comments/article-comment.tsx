import { Avatar, Grid, Group, Stack, Text } from "@mantine/core";
import React from "react";

import { formatRelativeTime } from "~/lib/format";
import { type ArticleComment } from "~/lib/models";

type ArticleCommentProps = {
  comment: ArticleComment;
};

export const ArticleCommentComponent = (props: ArticleCommentProps) => {
  return (
    <Grid mb={30} grow>
      <Grid.Col span={1}>
        <Avatar color="pink" size={44} radius="xl">
          {props.comment.authorName[0]?.toUpperCase() || "👽"}
        </Avatar>
      </Grid.Col>

      <Grid.Col span={11}>
        <Stack spacing={"xs"}>
          <Group noWrap>
            <Text weight={700} size={16}>
              {props.comment.authorName}
            </Text>

            <Text weight={400} size={14} color={"#6C757D"}>
              {formatRelativeTime(props.comment.createdAt)}
            </Text>
          </Group>

          <Text size={14} weight={400} color={"#212529"}>
            {props.comment.content}
          </Text>
        </Stack>
      </Grid.Col>
    </Grid>
  );
};
