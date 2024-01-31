import { ActionIcon, Group, Paper, Stack, Stepper } from "@mantine/core";
import { useContext, useEffect, useMemo, useState } from "react";
import { UserActionsEnum } from "@/@types/user-status.model";
import { IconArrowBackUp, IconHelpCircle } from "@tabler/icons-react";
import { StudentReportContext } from "@/app/_store/StudentReport.store";
import { PracticeSessionContext } from "@/app/_store/PracticeSession.store";
import { trpc } from "@/app/_trpc/client";
import { SRSModel } from "@/@types/srs.model";
import { Timer } from "./Timer";
import { Help } from "./session/Help";
import { Quiz } from "./session/Quiz";
import { Review } from "./session/Review";
import { Question } from "./session/Question";

export const StartSession = (studentId: string, initialState: SRSModel) => {
  const { mutate: saveReport } = trpc.saveStudentReport.useMutation();

  const { state: report, dispatch: reportDispatch } =
    useContext<any>(StudentReportContext);

  const [startTime, setStartTime] = useState(Date.now());

  const {
    state: { status, previousStatus },
    dispatch: practiceDispatch,
  } = useContext<any>(PracticeSessionContext);

  const [counter, setCounter] = useState(
    report.wrong.length + report.right.length
  );

  useEffect(() => {
    reportDispatch({ type: "initialState", props: initialState });
  }, [initialState]);

  // handles user flow when user completes a set
  useEffect(() => {
    // ensure there is a learning set, otherwise test them
    if (report.learningSet.length) {
      // do nothing if user is just moving through set
      if (counter < report.currentSet.length) {
        return;
      }

      // quiz user if they've gone through set 3 times
      if (report.iterations === 2) {
        practiceDispatch({ type: UserActionsEnum.test });
        return;
      }

      // show user results and save user report
      if (counter === report.currentSet.length && report.testing) {
        let elapsedTime = Math.round((Date.now() - startTime) / 1000);
        saveReport({
          studentId,
          report: JSON.stringify(report),
          elapsedTime,
        });
        practiceDispatch({ type: UserActionsEnum.test });
        return;
      }

      // iterate again if user didnt answer all questions in practice set, otherwise test them
      if (counter === report.currentSet.length && report.wrong.length) {
        reportDispatch({ type: "iterate" });
        setCounter(0);
      } else {
        practiceDispatch({ type: UserActionsEnum.test });
      }
    } else {
      practiceDispatch({ type: UserActionsEnum.test });
      return;
    }
  }, [counter, report]);

  useEffect(() => {
    if (status === UserActionsEnum.test) setStartTime(Date.now());
  }, [status]);

  const getHelpMessage = () => {
    return previousStatus === UserActionsEnum.review
      ? JSON.stringify(report.learningSet)
      : JSON.stringify(report.currentSet[counter]);
  };

  const Body = () => {
    switch (status) {
      case UserActionsEnum.help:
        return Help(getHelpMessage());
      case UserActionsEnum.test:
        return Quiz({
          setCounter,
          studentId,
        });
      case UserActionsEnum.review:
        return Review();
      default:
        return (
          <Question
            qandA={report.currentSet[counter]}
            counter={counter}
            setCounter={setCounter}
          />
        );
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
          <Stepper.Step label="Test" />
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
              <ActionIcon
                style={{ alignSelf: "end" }}
                size="xl"
                onClick={getHelp}
              >
                <IconHelpCircle />
              </ActionIcon>
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
                [status, counter]
              )}
            </Stack>
          </Stack>
        </Paper>
      </Group>
    </Stack>
  );
};
