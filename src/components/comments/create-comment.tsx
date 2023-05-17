import {
  ActionIcon,
  Avatar,
  Button,
  Group,
  Textarea,
  Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { type Article } from "@prisma/client";
import React from "react";

import { Alien } from "~/components/comments/alien";
import { api, type RouterInputs } from "~/utils/api";

type CreateCommentProps = {
  articleId: Article["id"];
};

export function CreateComment({ articleId }: CreateCommentProps) {
  const form = useForm<RouterInputs["comments"]["createNewComment"]>({
    initialValues: {
      content: "",
      articleId: articleId,
      authorName: "",
    },
  });

  const createComment = api.comments.createNewComment.useMutation();

  function handleSubmit(data: RouterInputs["comments"]["createNewComment"]) {
    if (!data.authorName) {
      notifications.show({
        title: "Please set your name",
        message: "Please click user avatar to set your name or try alien",
        color: "red",
      });
      return;
    }
    createComment.mutate(data);
    notifications.show({
      title: "Comment created",
      message: "Your comment was successfully created",
    });
    form.reset();
  }

  function createNewUser(alienGeneratedName: string) {
    /**
     * Did you get the joke? :)
     */
    form.setFieldValue("authorName", alienGeneratedName);
  }

  function handleClickAvatar() {
    const name = prompt("Enter your name");
    if (!name) return;
    createNewUser(name);
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Group noWrap>
        <Tooltip label={"Click here to set username"}>
          <ActionIcon onClick={handleClickAvatar}>
            <Avatar color={"pink"} w={44} />
          </ActionIcon>
        </Tooltip>

        <Textarea
          {...form.getInputProps("content")}
          placeholder="Join the discussion"
          required
          withAsterisk
          w={"100%"}
          rightSection={<Alien onClick={createNewUser} />}
        />

        <Button type={"submit"}>Create</Button>
      </Group>
    </form>
  );
}
