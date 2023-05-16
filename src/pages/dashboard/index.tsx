import { ActionIcon, Container, Group, Table } from "@mantine/core";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import { type GetServerSidePropsContext } from "next";
import Link from "next/link";
import React from "react";

import { getServerAuthSession } from "~/server/auth";
import { api } from "~/utils/api";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerAuthSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}

export default function DashboardPage() {
  const { data: articles, status } = api.article.getAll.useQuery();

  const ths = (
    <tr>
      <th>Article title</th>
      <th>Perex</th>
      <th>Author</th>
      <th># of comments</th>
      <th>actions</th>
    </tr>
  );

  const deleteArticle = api.article.deleteArticle.useMutation();

  function deleteWithConfirm(slug: string) {
    const res = confirm("Are you sure you want to delete this article?");
    if (!res) return;
    deleteArticle.mutate({ slug });
  }

  return (
    <Container>
      <h1>Dashboard</h1>

      <Table>
        <thead>{ths}</thead>
        <tbody>
          {status === "success" &&
            articles &&
            articles.map((article) => {
              return (
                <tr key={article.slug}>
                  <td>{article.title}</td>
                  <td>{article.perex}</td>
                  <td>{article.author_name}</td>
                  <td></td>
                  <td>
                    <Group noWrap>
                      <Link href={`/dashboard/${article.slug}/edit`}>
                        <IconPencil size="1.125rem" />
                      </Link>
                      <ActionIcon
                        onClick={() => deleteWithConfirm(article.slug)}
                      >
                        <IconTrash color={"red"} size="1.125rem" />
                      </ActionIcon>
                    </Group>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </Table>
    </Container>
  );
}
