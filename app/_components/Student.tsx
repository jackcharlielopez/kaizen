import { Button, Flex, Group, Paper, Stack, Text } from "@mantine/core";
import { createContext, useContext, useMemo, useState } from "react";
import { AccountContext } from "../accounts/layout";
import { Timer } from "./Timer";
import { trpc } from "../_trpc/client";
import {
  StudentPreviousReportContext,
  StudentSessionStatusContext,
  StudentSessionStatusEnum,
} from "@/@types/user-status.model";
import React from "react";
import { PracticeSRS } from "./PracticeSRS";
import { defaultSRSObj } from "@/@types/srs.model";

export const StudentSessionStatus =
  createContext<StudentSessionStatusContext | null>(null);

export const StudentPreviousReport =
  createContext<StudentPreviousReportContext | null>(null);

const Student = () => {
  let { id, name } = useContext(AccountContext);

  const [studentSessionStatus, setStudentSessionStatus] = useState(
    StudentSessionStatusEnum.default
  );

  // TODO wire this up to pull from last lesson or set to default
  const [studentPreviousReport, setStudentPreviousReport] =
    useState(defaultSRSObj);

  const studentPreviousReportvalue = {
    studentPreviousReport,
    setStudentPreviousReport,
  };

  // TODO save progress when user is finished
  const { data: promptResponse, mutate: promptRequest } =
    trpc.setOpenAiMessage.useMutation();

  const GetContent = () => {
    switch (studentSessionStatus) {
      case StudentSessionStatusEnum.start:
        return PracticeSRS();
      case StudentSessionStatusEnum.finished:
        return (
          <Text size={"xl"}>
            That's all we have for today. Great job! You got x/y correct
          </Text>
        );
      case StudentSessionStatusEnum.default:
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
      <StudentPreviousReport.Provider value={studentPreviousReportvalue}>
        <Stack justify="flex-start" gap={0}>
          <Group justify="flex-end">
            <Timer lengthOfTime={200}></Timer>
          </Group>
          <Group justify="center" h={500}>
            <Paper w={"60%"} shadow="md" withBorder p="xl" h={"70%"}>
              <Flex justify="center" align="center" h={"100%"}>
                <Stack align="center">
                  {useMemo(
                    () => (
                      <GetContent />
                    ),
                    [studentSessionStatus]
                  )}
                </Stack>
              </Flex>
            </Paper>
          </Group>
        </Stack>
      </StudentPreviousReport.Provider>
    </StudentSessionStatus.Provider>
  );
};

export default Student;
