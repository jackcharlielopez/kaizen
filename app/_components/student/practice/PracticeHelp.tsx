import { trpc } from "@/app/_trpc/client";
import { Center, Skeleton, Text } from "@mantine/core";
import { useEffect } from "react";

export const PracticeHelp = (content: string) => {
  const {
    mutate: getHelp,
    data: getHelpRes,
    isLoading: isLoadingText,
    isError,
  } = trpc.getHelpAI.useMutation();

  const {
    mutate: getHelpVoice,
    data: getVoiceRes,
    isLoading: isLoadingSpeech,
  } = trpc.converTextToSpeech.useMutation();

  useEffect(() => {
    getHelp(content);
  }, [content]);

  useEffect(() => {
    if (getHelpRes) getHelpVoice(getHelpRes.toLowerCase().replace("hint:", ""));
  }, [getHelpRes]);

  if (isLoadingSpeech || isLoadingText)
    return (
      <>
        <Skeleton height={16} />
        <Skeleton height={16} mt={"xs"} />
        <Skeleton height={48} mt={"xs"} w={250} />
      </>
    );

  if (isError) return <Text>Your tutor isn't available right now</Text>;

  return (
    <>
      <Text>{getHelpRes}</Text>
      {getVoiceRes && (
        <audio controls autoPlay>
          <source src={getVoiceRes} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      )}
    </>
  );
};
