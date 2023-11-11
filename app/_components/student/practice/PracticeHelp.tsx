import { trpc } from "@/app/_trpc/client";
import { Text } from "@mantine/core";
import { useEffect } from "react";

export const PracticeHelp = (content: string) => {
  const {
    mutate: getHelp,
    data: getHelpRes,
    isLoading,
    isError,
  } = trpc.getHelpAI.useMutation();

  const { mutate: getHelpVoice, data: getVoiceRes } =
    trpc.converTextToSpeech.useMutation();

  useEffect(() => {
    getHelp(content);
  }, [content]);

  useEffect(() => {
    if (getHelpRes) getHelpVoice(getHelpRes);
  }, [getHelpRes]);

  useEffect(() => {
    console.log(getVoiceRes);
  }, [getVoiceRes]);

  if (isLoading) return <Text>...loading</Text>;

  if (isError) return <Text>Your tutor isn't available right now</Text>;

  return <Text>{getHelpRes}</Text>;
};
