import {type GetServerSidePropsContext, type NextPage} from "next";

import {api} from "~/utils/api";
import React from "react";
import {Center, Container, Space, Stack, Title} from "@mantine/core";
import {ArticlePreview} from "~/lib/components/article";
import {createServerSideHelpers} from "@trpc/react-query/server";
import {appRouter} from "~/server/api/root";
import superjson from "superjson";
import {createContext} from "~/server/context";

export async function getServerSideProps(
    context: GetServerSidePropsContext<{ id: string }>,
) {
    const helpers = createServerSideHelpers({
        router: appRouter,
        ctx: await createContext(context),
        transformer: superjson,
    });
    await helpers.article.getAll.prefetch();
    return {
        props: {
            trpcState: helpers.dehydrate(),
        },
    };
}


const Home: NextPage = () => {
    const { data: articles } = api.article.getAll.useQuery()
    return (
        <Center>
            <Container>
                <Title order={1} sx={{fontSize: 40, fontWeight: 500}} color={'dark'}>Recent articles</Title>
                <Space h={60}/>
                <Stack sx={{gap: 32}}>
                    {articles?.map((article) => <ArticlePreview key={article?.slug} article={article}/>)}
                </Stack>
            </Container>
        </Center>
    );
};

export default Home;
