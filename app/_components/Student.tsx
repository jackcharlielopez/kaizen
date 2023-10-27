import { Button, Flex, Group, Paper, Stack, Text } from "@mantine/core";
import { useContext, useState } from "react";
import { AccountContext } from "../accounts/layout";
import { Timer, TimerStatus } from "./Timer";
import { trpc } from "../_trpc/client";
import { PromptNextQuestion } from "./prompts";

enum LearningStatus {
  "start",
  "stop",
  "finished",
}
const Student = () => {
  let { id } = useContext(AccountContext);
  const [timerStat, setTimerStat] = useState(TimerStatus.disabled);
  const [status, setStatus] = useState(LearningStatus.stop);
  const { data } = trpc.setOpenAiMessage.useQuery(PromptNextQuestion, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 1440,
  });

  const startAssessment = () => {
    setStatus(LearningStatus.start);
    setTimerStat(TimerStatus.start);
  };

  const Content = () => {
    switch (status) {
      case LearningStatus.start:
        return <Text size={"120px"}>{data?.response}</Text>;
      case LearningStatus.finished:
        return (
          <Text size={"xl"}>Great job today. Come back again tomorrow</Text>
        );
      default:
        return (
          <>
            <Text size={"xl"}>Welcome let's start our practice for today!</Text>
            <Button onClick={() => startAssessment()}>Start Assessment</Button>
          </>
        );
    }
  };

  return (
    <Stack justify="flex-start" gap={0}>
      <Group justify="flex-end">
        <Timer lengthOfTime={1200} status={timerStat}></Timer>
      </Group>
      <Group justify="center" h={500}>
        <Paper w={"60%"} shadow="md" withBorder p="xl" h={"70%"}>
          <Flex justify="center" align="center" h={"100%"}>
            <Content />
          </Flex>
        </Paper>
      </Group>
    </Stack>
  );
};

export default Student;
