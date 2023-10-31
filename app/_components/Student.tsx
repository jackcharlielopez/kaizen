import { Button, Flex, Group, Paper, Stack, Text } from "@mantine/core";
import { createContext, useContext, useState } from "react";
import { AccountContext } from "../accounts/layout";
import { Timer } from "./Timer";
import { trpc } from "../_trpc/client";
import {
  StudentSessionStatusContext,
  StudentSessionStatusEnum,
} from "@/@types/user-status.model";
import React from "react";
import { PracticeSRS } from "./PracticeSRS";

export const StudentSessionStatus =
  createContext<StudentSessionStatusContext | null>(null);

const Student = () => {
  let { id, name } = useContext(AccountContext);
  const [studentSessionStatus, setStudentSessionStatus] = useState(
    StudentSessionStatusEnum.default
  );
  const { data: promptResponse, mutate: promptRequest } =
    trpc.setOpenAiMessage.useMutation();

  const GetContent = () => {
    switch (studentSessionStatus) {
      case StudentSessionStatusEnum.start:
        return PracticeSRS();
      case StudentSessionStatusEnum.stop:
        return <Text size={"120px"}>{promptResponse?.content}</Text>;
      case StudentSessionStatusEnum.finished:
        return (
          <Text size={"xl"}>
            That's all we have for today. Great job! You got x/y correct
          </Text>
        );
      default:
        return (
          <>
            <Text size={"xl"}>
              Welcome back {name}. Lets get started on learning!
            </Text>
            <Button onClick={() => startAssessment()}>Start Assessment</Button>
          </>
        );
    }
  };

  const startAssessment = () => {
    setStudentSessionStatus(StudentSessionStatusEnum.start);
  };

  return (
    <StudentSessionStatus.Provider
      value={{ studentSessionStatus, setStudentSessionStatus }}
    >
      <Stack justify="flex-start" gap={0}>
        <Group justify="flex-end">
          <Timer lengthOfTime={200}></Timer>
        </Group>
        <Group justify="center" h={500}>
          <Paper w={"60%"} shadow="md" withBorder p="xl" h={"70%"}>
            <Flex justify="center" align="center" h={"100%"}>
              <Stack align="center">
                <GetContent />
              </Stack>
            </Flex>
          </Paper>
        </Group>
      </Stack>
    </StudentSessionStatus.Provider>
  );
};

export default Student;
