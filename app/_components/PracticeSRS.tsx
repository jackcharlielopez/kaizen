import {
  defaultSRSObj,
  generateLearningSet,
  shuffleArr,
} from "@/@types/srs.model";
import { Button, Center, Group, List, Stack, Text } from "@mantine/core";
import { useContext, useEffect, useMemo, useState } from "react";
import {
  StudentPreviousReportContext,
  StudentSessionStatusContext,
  StudentSessionStatusEnum,
} from "@/@types/user-status.model";
import { StudentPreviousReport, StudentSessionStatus } from "./Student";
import { QuestionAnswer } from "./QuestionAnswer";

enum UserActionsEnum {
  "test",
  "help",
  "practice",
  "review",
}
export const PracticeSRS = () => {
  const { studentPreviousReport, setStudentPreviousReport } =
    useContext<StudentPreviousReportContext | null>(StudentPreviousReport);
  const { studentSessionStatus, setStudentSessionStatus } =
    useContext<StudentSessionStatusContext | null>(StudentSessionStatus);

  const generatedLearningSet = generateLearningSet(
    studentPreviousReport.OOO,
    studentPreviousReport.currentSection
  );

  const [learningSet, setLearningSet] = useState(generatedLearningSet);
  const [counter, setCounter] = useState(0);
  const [userActions, setUserActions] = useState(UserActionsEnum.review);

  useEffect(() => {
    if (counter < learningSet.length) {
      return;
    }

    if (studentPreviousReport.iterations === 2) {
      setUserActions(UserActionsEnum.test);
      return;
    }

    if (counter === learningSet.length && studentPreviousReport.test) {
      setUserActions(UserActionsEnum.test);
      return;
    }

    if (counter === learningSet.length && studentPreviousReport.wrong.length) {
      // move learning set to be whatever user got wrong
      setLearningSet(studentPreviousReport.wrong);
      // clear out the wrong category and update iteration
      setStudentPreviousReport({
        ...studentPreviousReport,
        iterations: studentPreviousReport.iterations + 1,
        right: [],
        wrong: [],
      });
      // restart counter
      setCounter(0);
    } else {
      setUserActions(UserActionsEnum.test);
    }
  }, [
    counter,
    learningSet,
    setStudentPreviousReport,
    setStudentSessionStatus,
    studentPreviousReport,
  ]);

  const Body = () => {
    switch (userActions) {
      case UserActionsEnum.help:
        return <Text>Your AI will help</Text>;
      case UserActionsEnum.practice:
        return (
          <Center>
            <QuestionAnswer
              qandA={learningSet[counter]}
              counter={counter}
              setCounter={setCounter}
            ></QuestionAnswer>
          </Center>
        );
      case UserActionsEnum.test:
        if (studentPreviousReport.test) {
          return (
            <Group justify="center">
              <Text>
                Your results were:{studentPreviousReport.right.length} /{" "}
                {learningSet.length}{" "}
              </Text>
              {studentPreviousReport.wrong.length ? (
                <Button onClick={keepPracticing}>Keep Practicing</Button>
              ) : (
                <Button onClick={nextLesson}>
                  Next Lesson ({studentPreviousReport.currentSection + 1}'s)
                </Button>
              )}
            </Group>
          );
        } else {
          return (
            <Group justify="center">
              <Text>
                We've done a lot of practicing, I think you are ready for the
                quiz. If not lets practice some more.
              </Text>
              <Button onClick={startQuiz}>Start Quiz</Button>
              {studentPreviousReport.wrong.length && (
                <Button onClick={keepPracticing}>Keep Practicing</Button>
              )}
            </Group>
          );
        }
      default:
        return (
          <Stack align="center">
            <List>
              <List.Item>List of lessons points</List.Item>
            </List>
            <Button onClick={startPracticing}>Start Practice</Button>
          </Stack>
        );
    }
  };

  const reset = () => {
    setStudentPreviousReport({
      ...studentPreviousReport,
      iterations: studentPreviousReport.iterations++,
      right: [],
      wrong: [],
    });
    setCounter(0);
  };

  const startQuiz = () => {
    setLearningSet(shuffleArr(generatedLearningSet));
    reset();
    setStudentPreviousReport({ ...studentPreviousReport, test: true });
    setUserActions(UserActionsEnum.practice);
  };

  const keepPracticing = () => {
    setLearningSet(studentPreviousReport.wrong);
    reset();
    setUserActions(UserActionsEnum.practice);
  };

  const startPracticing = () => {
    setLearningSet(generatedLearningSet);
    reset();
    setUserActions(UserActionsEnum.practice);
  };

  const nextLesson = () => {
    // save progress on previous lesson start new one
    setStudentPreviousReport({
      ...defaultSRSObj,
      currentSection: studentPreviousReport.currentSection + 1,
    });
    generateLearningSet;
    setCounter(0);
  };

  const getHelp = () => {
    setUserActions(UserActionsEnum.help);
    // reach out to AI for help
  };

  return <Body />;
};
