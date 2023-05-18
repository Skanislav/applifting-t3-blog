import { Space, Stack, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { type CommentRatings } from "@prisma/client";
import React from "react";

import { ArticleCommentComponent } from "~/components/comments/article-comment";
import { CreateComment } from "~/components/comments/create-comment";
import { type ArticleDetailEntity } from "~/lib/models";
import { wsApi } from "~/utils/ws";

type CommentsListProps = {
  comments: ArticleDetailEntity["comments"];
  articleId: string;
  userIp: string | string[] | undefined;
};

export const ArticleComments = ({
  comments,
  articleId,
  userIp,
}: CommentsListProps) => {
  const upvoteMutation = wsApi.comments.upVoteComment.useMutation({
    onError() {
      notifications.show({
        title: "Error",
        message: "You can only vote once per comment",
        color: "red",
      });
    },
    onSuccess() {
      notifications.show({
        title: "Success",
        message: "Your vote was counted",
        color: "green",
      });
    },
  });
  const [commentsData, setComments] = React.useState<
    ArticleDetailEntity["comments"]
  >(() => comments);
  const [upVoteData, setUpVoteData] = React.useState<
    Record<CommentRatings["id"], number>
  >({});

  wsApi.comments.onCreate.useSubscription(undefined, {
    onData(post) {
      setComments((comments) => {
        return [
          {
            ...post,
            countRatings: 0,
          },
          ...comments,
        ];
      });
    },
    onError(err) {
      console.error("Subscription error:", err);
    },
  });

  wsApi.comments.onUpVote.useSubscription(undefined, {
    onData(newUpVote) {
      const { commentId, rating } = newUpVote;

      if (commentId === undefined || rating === undefined) {
        return;
      }

      setUpVoteData((currentData) => {
        return {
          ...currentData,
          [commentId]: rating === "up" ? 1 : -1,
        };
      });

      setComments((comments) => {
        return comments.map((c) => {
          if (c.id === commentId) {
            const existingRating = upVoteData[c.id] || 0;
            return {
              ...c,
              countRatings: c.countRatings + existingRating,
            };
          }

          return c;
        });
      });
    },
  });

  const commentsWithRatings = React.useMemo(() => {
    return commentsData.map((c) => {
      const existingRating = upVoteData[c.id] || 0;
      return {
        ...c,
        countRatings: c.countRatings + existingRating,
      };
    });
  }, [commentsData, upVoteData]);

  function handleVoteClick(commentId: string, vote: "up" | "down") {
    const resolveUserIp = Array.isArray(userIp) ? userIp[0] : userIp;
    upvoteMutation.mutate({
      commentId: commentId,
      rate: vote,
      userIp: resolveUserIp || "unknown",
    });
  }

  return (
    <Stack>
      <Text weight={500} size={24}>
        Comments {`(${commentsWithRatings.length || 0})`}
      </Text>

      <CreateComment articleId={articleId} />

      <Space h={30} />

      {commentsWithRatings.map((c) => {
        return (
          <ArticleCommentComponent
            onVote={handleVoteClick}
            key={c.id}
            comment={c}
          />
        );
      })}
    </Stack>
  );
};
