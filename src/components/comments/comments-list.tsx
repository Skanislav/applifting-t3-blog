import { Stack } from "@mantine/core";
import React from "react";

import { ArticleCommentComponent } from "~/components/comments/article-comment";
import { type ArticleComment } from "~/lib/models";

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
