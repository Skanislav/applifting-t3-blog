import { ActionIcon, Avatar, Grid, Group, Stack, Text } from "@mantine/core";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import React from "react";

import { formatRelativeTime } from "~/lib/format";
import { type ArticleDetailEntity } from "~/lib/models";

type ArticleCommentProps = {
  comment: ArticleDetailEntity["comments"][0];
  onVote: (commentId: string, vote: "up" | "down") => void;
};

export const ArticleCommentComponent = (props: ArticleCommentProps) => {
  function handleUpVoteClick() {
    props.onVote(props.comment.id, "up");
  }

  function handleDownVoteClick() {
    props.onVote(props.comment.id, "down");
  }

  return (
    <Stack spacing={"xs"}>
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

            <Group>
              <Text size={14} weight={400} color={"#212529"}>
                {props.comment.countRatings > 0
                  ? `+${props.comment.countRatings}`
                  : props.comment.countRatings}
              </Text>

              <ActionIcon onClick={handleUpVoteClick}>
                <IconChevronUp />
              </ActionIcon>

              <ActionIcon onClick={handleDownVoteClick}>
                <IconChevronDown />
              </ActionIcon>
            </Group>
          </Stack>
        </Grid.Col>
      </Grid>
    </Stack>
  );
};
