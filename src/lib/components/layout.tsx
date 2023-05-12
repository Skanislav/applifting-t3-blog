import {AppShell, Text, Container, Group, Header, SimpleGrid} from "@mantine/core";
import React from "react";
import Image from 'next/image'
import logo from 'public/logo.jpg'
import Link from "next/link";
import {SignInModal} from "~/lib/components/sign-in";
import {useSession} from "next-auth/react";

export default function Layout({children}: React.PropsWithChildren) {
    const session = useSession();
    const isAuthenticated = session.status === 'authenticated';

    return <AppShell
        padding="md"
        header={<Header bg={'#F8F9FA'} height={56}>
            <Container>
                <SimpleGrid h={56} cols={2}>
                    <Group align={'center'} >
                        <Image src={logo} alt={'logo'}/>
                        <Text component={Link} href={'/'} color={'#6C757D'}>
                            Recent Articles
                        </Text>
                        <Text component={Link} href={'/about'} color={'#6C757D'}>
                            About
                        </Text>
                        <Text component={Link} href={'/docs'} color={'#6C757D'}>
                            REST API Docs
                        </Text>
                    </Group>
                    <Group align={'center'} ml={'auto'}>
                        {!isAuthenticated && <SignInModal/>}
                        <Text>
                            {session.data?.user?.name}
                        </Text>
                    </Group>
                </SimpleGrid>
            </Container>
        </Header>}
    >
        {children}
    </AppShell>
}