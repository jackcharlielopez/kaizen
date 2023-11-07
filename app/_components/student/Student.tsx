import { Group, Paper, Stack } from "@mantine/core";
import { useContext, useMemo } from "react";
import { AccountContext } from "../../accounts/layout";
import { Timer } from "./Timer";
import { StudentSessionStatusEnum } from "@/@types/user-status.model";
import React from "react";
import { StartPractice } from "./StartPractice";
import { EndPractice } from "./EndPractice";
import { IntroPractice } from "./IntroPractice";
import { StudentSessionContext } from "@/app/_store/StudentSession.store";
import { PracticeSessionProvider } from "@/app/_store/PracticeSession.store";
import { StudentReportProvider } from "@/app/_store/StudentReport.store";

// TODO save when user is finished
const Student = () => {
  const { name } = useContext(AccountContext);
  const {
    state: { status },
  } = useContext(StudentSessionContext);

  const GetContent = () => {
    switch (status) {
      case StudentSessionStatusEnum.start:
        return StartPractice();
      case StudentSessionStatusEnum.finished:
        return EndPractice();
      case StudentSessionStatusEnum.stop:
        return "Will take a quick break";
      case StudentSessionStatusEnum.default:
        return <IntroPractice name={name.split(" ")[0]} />;
    }
  };

  return (
    <StudentReportProvider>
      <PracticeSessionProvider>
        <Stack justify="flex-start" gap={0}>
          <Group justify="flex-end">
            <Timer lengthOfTime={1200}></Timer>
          </Group>
          <Group justify="center" h={500}>
            <Paper w={"60%"} shadow="md" withBorder p="sm" h={"70%"}>
              <Stack align="center" justify="center" h="100%">
                {useMemo(
                  () => (
                    <GetContent />
                  ),
                  [status]
                )}
              </Stack>
            </Paper>
          </Group>
        </Stack>
      </PracticeSessionProvider>
    </StudentReportProvider>
  );
};

export default Student;
