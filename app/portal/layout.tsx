"use client";

import { AppShell, Box, Button, Flex, Grid } from "@mantine/core";
import Image from "next/image";

const name = "Jack";

const PortalLayout = ({ children }: { children: React.ReactNode }) => {
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
              Welcome {name} <Button>Logout</Button>
            </Box>
          </Grid.Col>
        </Grid>
      </AppShell.Header>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
};

export default PortalLayout;
