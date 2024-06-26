import { ActionIcon, Group, Paper, Stack, Stepper } from "@mantine/core";
import { useContext, useMemo } from "react";
import { UserActionsEnum } from "@/@types/user-status.model";
import { IconArrowBackUp, IconHelpCircle } from "@tabler/icons-react";
import { StudentReportContext } from "@/app/_store/StudentReport.store";
import { PracticeSessionContext } from "@/app/_store/PracticeSession.store";
import { Timer } from "./Timer";
import { Help } from "./session/Help";
import { Quiz } from "./session/Quiz";
import { Review } from "./session/Review";
import { Practice } from "./session/Practice";

export const StartSession = () => {
  const { state: report } = useContext<any>(StudentReportContext);

  const {
    state: { status, previousStatus },
    dispatch: practiceDispatch,
  } = useContext<any>(PracticeSessionContext);

  const getHelpMessage = () => {
    return JSON.stringify(report.learningSet);
  };

  const Body = () => {
    switch (status) {
      case UserActionsEnum.help:
        return Help(getHelpMessage());
      case UserActionsEnum.quiz:
        return Quiz();
      case UserActionsEnum.review:
        return Review();
      default:
        return Practice();
    }
  };

  const getHelp = () => {
    practiceDispatch({ type: UserActionsEnum.help });
  };

  const goBack = () => {
    practiceDispatch({ type: previousStatus });
  };

  return (
    <Stack justify="flex-start" gap={0}>
      <Group justify="flex-end">
        <Timer lengthOfTime={300}></Timer>
      </Group>

      <Group justify="center">
        <Stepper active={status} allowNextStepsSelect={false}>
          <Stepper.Step label="Review" />
          <Stepper.Step label="Practice" />
          <Stepper.Step label="Quiz" />
        </Stepper>
      </Group>

      <Group justify="center" h={500}>
        <Paper w={"60%"} shadow="md" withBorder p="sm" h={"70%"}>
          <Stack align="center" justify="center" h="100%" gap={"0"}>
            {status === UserActionsEnum.help ? (
              <ActionIcon
                autoFocus
                style={{ alignSelf: "end" }}
                size="xl"
                onClick={goBack}
              >
                <IconArrowBackUp />
              </ActionIcon>
            ) : (
              status === UserActionsEnum.practice ||
              (status === UserActionsEnum.review && (
                <ActionIcon
                  style={{ alignSelf: "end" }}
                  size="xl"
                  onClick={getHelp}
                >
                  <IconHelpCircle />
                </ActionIcon>
              ))
            )}
            <Stack
              align="center"
              justify="center"
              h={"100%"}
              w={"100%"}
              mt="-44px"
            >
              {useMemo(
                () => (
                  <Body />
                ),
                [status]
              )}
            </Stack>
          </Stack>
        </Paper>
      </Group>
    </Stack>
  );
};
