"use client";

import { Avatar, Box, Group } from "@mantine/core";
import { trpc } from "../_trpc/client";
import { useSession } from "next-auth/react";

// this will be netflix style profile creation and choosing
// this should skip if only profile that exists is parents
// this should fetch children on the server

const SelectProfile = () => {
  const { data } = trpc.getStudents.useQuery();
  const { data: session, status } = useSession();

  console.log(session, data, status);

  const getInitials = (name: string) => {
    const splitName = name.split(" ");
    return splitName[0].charAt(0).concat(splitName[1].charAt(0));
  };

  if (status === "loading") return <Box>Loading...</Box>;

  return (
    <Group justify="center" gap="xl">
      <Avatar variant="filled" radius="sm" size="xl">
        {getInitials(session?.user.name)}
      </Avatar>
      {data?.map((item) => (
        <Avatar key={item.id} variant="filled" radius="sm" size="xl">
          {getInitials(item.name)}
        </Avatar>
      ))}
    </Group>
  );
};

export default SelectProfile;
