import { api } from "~/utils/api";
import React from "react";
import { ActionIcon, Container, Group, Table } from "@mantine/core";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import { type GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "~/server/auth";

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

  function deleteWithConfirm() {
    // to implement
    void 0;
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
                      <ActionIcon onClick={deleteWithConfirm}>
                        <IconPencil size="1.125rem" />
                      </ActionIcon>
                      <ActionIcon onClick={deleteWithConfirm}>
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
