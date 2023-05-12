import {type AppType} from "next/app";
import {type Session} from "next-auth";
import {SessionProvider} from "next-auth/react";

import {api} from "~/utils/api";

import "~/styles/globals.css";
import React from "react";
import Head from "next/head";
import {MantineProvider} from "@mantine/core";
import Layout from "~/lib/components/layout";
import {Notifications} from "@mantine/notifications";
import { type InferGetServerSidePropsType} from "next";
import {type getServerSideProps} from "~/pages/index";

const MyApp: AppType<{ session: Session | null & InferGetServerSidePropsType<typeof getServerSideProps> }> = (
    {
        Component,
        pageProps: {session, ...pageProps},
    }) => {
    return (
        <>
            <Head>
                <title>Skas AppLifting Blog</title>
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width"/>
            </Head>

            <MantineProvider
                withGlobalStyles
                withNormalizeCSS
                theme={{
                    colorScheme: 'light',
                }}
            >
                <Notifications position={'top-center'} />
                <SessionProvider session={session}>
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </SessionProvider>
            </MantineProvider>
        </>
    );
};

export default api.withTRPC(MyApp);
