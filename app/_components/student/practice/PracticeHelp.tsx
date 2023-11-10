import { trpc } from "@/app/_trpc/client";
import { Text } from "@mantine/core";
import { useEffect } from "react";

export const PracticeHelp = (content: string) => {
  const {
    mutate: getHelp,
    data,
    isLoading,
    isError,
  } = trpc.getHelpAI.useMutation();

  useEffect(() => getHelp(content), [content]);

  if (isLoading) return <Text>...loading</Text>;

  if (isError) return <Text>Your tutor isn't available right now</Text>;

  return <Text>{data}</Text>;
};
