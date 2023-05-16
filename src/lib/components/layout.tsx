import {
  AppShell,
  Avatar,
  Button,
  Container,
  Group,
  Header,
  Popover,
  SimpleGrid,
  Text,
} from "@mantine/core";
import Image from "next/image";
import Link from "next/link";
import { signOut as nextAuthSignOut, useSession } from "next-auth/react";
import logo from "public/logo.jpg";
import React, { useState } from "react";

import { SignInModal } from "~/lib/components/sign-in";

export default function Layout({ children }: React.PropsWithChildren) {
  const session = useSession();
  const isAuthenticated = session.status === "authenticated";
  const [opened, setOpened] = useState(false);

  async function signOut() {
    await nextAuthSignOut();
  }

  return (
    <AppShell
      padding="md"
      header={
        <Header bg={"#F8F9FA"} height={56}>
          <Container size={"xl"}>
            <SimpleGrid h={56} cols={2}>
              <Group align={"center"}>
                <Image src={logo} alt={"logo"} />
                <Text component={Link} href={"/"} color={"#6C757D"}>
                  Recent Articles
                </Text>
                <Text component={Link} href={"/about"} color={"#6C757D"}>
                  About
                </Text>
                <Text component={Link} href={"/docs"} color={"#6C757D"}>
                  REST API Docs
                </Text>
              </Group>
              <Group align={"center"} ml={"auto"}>
                {!isAuthenticated && <SignInModal />}
                {isAuthenticated && (
                  <>
                    <Text
                      component={Link}
                      href={"/dashboard"}
                      color={"#6C757D"}
                    >
                      My Articles
                    </Text>

                    <Text
                      component={Link}
                      href={"/dashboard/create-article"}
                      color={"#007BFF"}
                    >
                      Create Article
                    </Text>

                    <Popover opened={opened} onChange={setOpened}>
                      <Popover.Target>
                        <Avatar
                          onClick={() => setOpened((o) => !o)}
                          color="pink"
                          radius="xl"
                        >
                          U
                        </Avatar>
                      </Popover.Target>

                      <Popover.Dropdown>
                        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
                        <Button onClick={signOut}>Sign out</Button>
                      </Popover.Dropdown>
                    </Popover>
                  </>
                )}
              </Group>
            </SimpleGrid>
          </Container>
        </Header>
      }
    >
      {children}
    </AppShell>
  );
}
