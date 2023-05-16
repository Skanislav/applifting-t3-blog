import { type ArticleComment } from "~/lib/models";
import { ArticleCommentComponent } from "~/lib/components/comments/article-comment";
import React from "react";
import { Stack } from "@mantine/core";

type CommentsListProps = {
  comments: Omit<ArticleComment, "">[];
};

export const ArticleComments = ({ comments }: CommentsListProps) => {
  return (
    <Stack>
      {comments.map((c) => {
        return <ArticleCommentComponent key={c.id} comment={c} />;
      })}
    </Stack>
  );
};
