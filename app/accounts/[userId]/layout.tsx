"use client";

import { AppShell, Box, Button, Grid } from "@mantine/core";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";

// generic layout for users (header, footer, open body)
// body needs to be driven by account type parent or student
const AccountLayout = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();

  return (
    <AppShell padding="md">
      <AppShell.Header bg="blue" p={8} c="white">
        <Grid justify="space-between" align="center">
          <Grid.Col span="content">
            <Image
              src="/logo.svg"
              width={0}
              height={0}
              style={{ width: "auto", height: "48px" }}
              alt="Kaizen Logo"
            />
          </Grid.Col>
          <Grid.Col span="content">
            <Box>
              Welcome {session?.user?.name}
              <Button onClick={() => signOut()}>Logout</Button>
            </Box>
          </Grid.Col>
        </Grid>
      </AppShell.Header>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
};

export default AccountLayout;
