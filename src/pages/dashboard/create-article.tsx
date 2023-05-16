import { Button, Container } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

import { ArticleForm } from "~/lib/components/dashboard/article-form";
import { api, type RouterInputs } from "~/utils/api";

export default function CreateArticlePage() {
  const router = useRouter();
  const createArticle = api.article.createNewArticle.useMutation();

  useEffect(() => {
    if (createArticle.status !== "success") return;
    notifications.show({
      title: "Success",
      message: "Article created",
      variant: "success",
    });
    router.push(`/dashboard`);
  }, [createArticle.status, router]);

  function handleSubmit({
    image,
    content,
    title,
  }: RouterInputs["article"]["createNewArticle"]): void {
    if (!image || !content?.length || !title) {
      notifications.show({
        title: "Error",
        message: "Please fill all fields",
        variant: "error",
      });

      return;
    }

    createArticle.mutate({ title, content, image: image });
    return;
  }

  return (
    <Container>
      <ArticleForm onSubmit={handleSubmit}>
        {createArticle.error && (
          <p>Something went wrong! {createArticle.error.message}</p>
        )}

        <Button disabled={createArticle.isLoading} type={"submit"}>
          Create
        </Button>
      </ArticleForm>
    </Container>
  );
}
