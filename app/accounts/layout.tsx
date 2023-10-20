"use client";

import {
  AppShell,
  Avatar,
  Box,
  Button,
  Grid,
  Group,
  Modal,
} from "@mantine/core";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { trpc } from "../_trpc/client";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { Student } from "@prisma/client";

interface userProps {
  role: string;
  name: string;
  id: string;
}

const getInitials = (name: string) => {
  const splitName = name.split(" ");
  return splitName[0].charAt(0).concat(splitName[1].charAt(0));
};

const AccountLayout = ({ children }: { children: React.ReactNode }) => {
  const { data } = trpc.getStudents.useQuery();
  const { data: session, status } = useSession();
  const [props, setProps] = useState<userProps | undefined>();

  const [opened, handlers] = useDisclosure(true);

  const setUserProps = (role: "student" | "parent", item?: any) => {
    if (role === "student" && item) {
      setProps({ role: "student", name: item?.name, id: item?.id });
    } else {
      setProps({
        role: "parent",
        name: session?.user.name,
        id: session?.user.id,
      });
    }

    handlers.close();
  };

  if (status === "loading") return <Box>Loading...</Box>;

  if (props && status === "authenticated" && !opened) {
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
              <Group justify="center" gap="xs">
                Welcome {props.name}
                <Avatar
                  variant="filled"
                  radius="lg"
                  size="sm"
                  component="button"
                  onClick={() => handlers.open()}
                ></Avatar>
                <Button onClick={() => signOut()}>Logout</Button>
              </Group>
            </Grid.Col>
          </Grid>
        </AppShell.Header>

        <AppShell.Main>{children}</AppShell.Main>
      </AppShell>
    );
  }

  return (
    <Modal
      opened={opened}
      onClose={close}
      withCloseButton={false}
      fullScreen
      radius={0}
      transitionProps={{ transition: "fade", duration: 200 }}
    >
      <Group justify="center" gap="xl">
        <Avatar
          variant="filled"
          radius="sm"
          size="xl"
          component="button"
          onClick={() => setUserProps("parent")}
        >
          {getInitials(session?.user.name)}
        </Avatar>
        {data?.map((item) => (
          <Avatar
            key={item.id}
            variant="filled"
            radius="sm"
            size="xl"
            component="button"
            onClick={() => setUserProps("student", item)}
          >
            {getInitials(item.name)}
          </Avatar>
        ))}
      </Group>
    </Modal>
  );
};

export default AccountLayout;
