import { type ArticleComment } from "~/lib/models";
import React from "react";
import { Text, Avatar, Grid, Stack, Group } from "@mantine/core";
import { formatRelativeTime } from "~/lib/format";

type ArticleCommentProps = {
  comment: ArticleComment;
};

export const ArticleCommentComponent = (props: ArticleCommentProps) => {
  return (
    <Grid mb={10}>
      <Grid.Col span={1}>
        <Avatar color="pink" size={44} radius="xl">
          {props.comment.authorName[0]?.toUpperCase() || "👽"}
        </Avatar>
      </Grid.Col>

      <Grid.Col span={11}>
        <Stack>
          <Group noWrap>
            <Text weight={700} size={16}>
              {props.comment.authorName}
            </Text>

            <Text weight={400} size={14} color={"#6C757D"}>
              {formatRelativeTime(props.comment.createdAt)}
            </Text>
          </Group>

          <Text>{props.comment.content}</Text>
        </Stack>
      </Grid.Col>
    </Grid>
  );
};
