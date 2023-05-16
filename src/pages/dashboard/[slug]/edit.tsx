import { Button, Container } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { createServerSideHelpers } from "@trpc/react-query/server";
import {
  type GetServerSidePropsContext,
  type InferGetServerSidePropsType,
} from "next";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import superjson from "superjson";

import { ArticleForm } from "~/lib/components/dashboard/article-form";
import { appRouter } from "~/server/api/root";
import { createContext } from "~/server/context";
import { api, type RouterInputs } from "~/utils/api";

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ slug: string }>
) {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: await createContext(context),
    transformer: superjson,
  });
  const slug = context.params?.slug || "";
  await helpers.article.getBySlug.prefetch({ slug });
  return {
    props: {
      trpcState: helpers.dehydrate(),
      slug,
    },
  };
}

export default function Edit({
  slug,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const article = api.article.getBySlug.useQuery({ slug });

  const editArticle = api.article.editArticle.useMutation();

  useEffect(() => {
    if (editArticle.status !== "success") return;
    notifications.show({
      title: "Success",
      message: "Article edited successfully",
      variant: "success",
    });
    router.push(`/dashboard`);
  }, [editArticle.status, router]);

  function handleSubmit({
    image,
    content,
    title,
  }: RouterInputs["article"]["createNewArticle"]): void {
    editArticle.mutate({ slug, title, content, image });
    return;
  }

  if (!article.data) {
    return null;
  }

  return (
    <>
      <Container>
        <ArticleForm article={article.data} onSubmit={handleSubmit}>
          {editArticle.error && (
            <p>Something went wrong! {editArticle.error.message}</p>
          )}

          <Button disabled={editArticle.isLoading} type={"submit"}>
            Edit
          </Button>
        </ArticleForm>
      </Container>
    </>
  );
}
