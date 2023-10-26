"use client";

import {
  Avatar,
  Box,
  Button,
  Container,
  Flex,
  Group,
  Modal,
  Stack,
} from "@mantine/core";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { trpc } from "../_trpc/client";
import { useDisclosure } from "@mantine/hooks";
import { createContext, useState } from "react";
import { Student } from "@prisma/client";

export interface userProps {
  role: string;
  name: string;
  id: string;
  students?: Student[];
}

const getInitials = (name: string) => {
  const splitName = name.split(" ");
  return splitName[0].charAt(0).concat(splitName[1].charAt(0));
};

export const AccountContext = createContext<userProps | undefined>(undefined);

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
        students: data || [],
      });
    }

    handlers.close();
  };

  if (status === "loading") return <Box>Loading...</Box>;

  if (props && status === "authenticated" && !opened) {
    return (
      <Stack h={"100vh"} bg={"blue"} gap={0}>
        <Group justify="space-between" p={8} bg={"white"}>
          <Image
            src="/logo.svg"
            width={0}
            height={0}
            style={{ width: "auto", height: "48px" }}
            alt="Kaizen Logo"
          />
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
        </Group>

        <AccountContext.Provider value={{ ...props }}>
          {children}
        </AccountContext.Provider>
      </Stack>
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
      <Flex
        h={"calc(100vh - 32px"}
        gap="sm"
        justify="center"
        align="center"
        direction="row"
        wrap="wrap"
      >
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
      </Flex>
    </Modal>
  );
};

export default AccountLayout;
