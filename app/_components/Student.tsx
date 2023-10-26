import { Box, Flex, Group, Paper, Stack, Text } from "@mantine/core";
import { useContext, useState } from "react";
import { AccountContext } from "../accounts/layout";
import { Timer, TimerStatus } from "./Timer";
import { trpc } from "../_trpc/client";

const Student = () => {
  let message = {
    role: "user",
    content:
      'You are a tutor for an elementary school. Provide a math question to test my ability. Make sure each math question is formatted as "x + y = z"',
  };
  let messages = [];

  messages.push(message);

  let { id } = useContext(AccountContext);
  const [timerStat, setTimerStat] = useState(TimerStatus.disabled);
  const { data } = trpc.setOpenAiMessage.useQuery(messages);

  console.log(data);

  return (
    <Stack justify="flex-start" gap={0}>
      <Group justify="flex-end">
        <Timer lengthOfTime={1200} status={timerStat}></Timer>
      </Group>
      <Group justify="center" h={500}>
        <Paper w={"60%"} shadow="md" withBorder p="xl" h={"70%"}>
          <Text>flash card</Text>
        </Paper>
      </Group>
    </Stack>
  );
};

export default Student;
