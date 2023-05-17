import { Space, Stack, Text } from "@mantine/core";
import React from "react";

import { ArticleCommentComponent } from "~/components/comments/article-comment";
import { CreateComment } from "~/components/comments/create-comment";
import { type ArticleComment } from "~/lib/models";
import { api } from "~/utils/api";

type CommentsListProps = {
  comments: ArticleComment[];
  articleId: string;
};

export const ArticleComments = ({ comments, articleId }: CommentsListProps) => {
  const [commentsData, setComments] = React.useState(() => comments);
  api.comments.onCreate.useSubscription(undefined, {
    onData(post) {
      setComments((comments) => {
        return [post, ...comments];
      });
    },
    onError(err) {
      console.error("Subscription error:", err);
    },
  });

  return (
    <Stack>
      <Text weight={500} size={24}>
        Comments {`(${commentsData.length || 0})`}
      </Text>

      <CreateComment articleId={articleId} />

      <Space h={30} />

      {commentsData.map((c) => {
        return <ArticleCommentComponent key={c.id} comment={c} />;
      })}
    </Stack>
  );
};
