import { UserActionsEnum } from "@/@types/user-status.model";
import { Group, Button, Text, Stack, Space } from "@mantine/core";
import { useContext } from "react";
import {
  defaultSRSObj,
  findNextSubject,
  maxPerLesson,
} from "@/@types/srs.model";
import { StudentReportContext } from "@/app/_store/StudentReport.store";
import { PracticeSessionContext } from "@/app/_store/PracticeSession.store";
import { trpc } from "@/app/_trpc/client";

export const PracticeTest = ({
  setCounter,
  studentId,
}: {
  setCounter: any;
  studentId: string;
}) => {
  const { state: reportState, dispatch: reportDispatch } =
    useContext<any>(StudentReportContext);

  const { mutate: saveReport } = trpc.saveStudentReport.useMutation();

  const { dispatch: practiceDispatch } = useContext<any>(
    PracticeSessionContext
  );

  const startQuiz = () => {
    reportDispatch({ type: "quiz" });
    practiceDispatch({ type: UserActionsEnum.practice });
    setCounter(0);
  };

  const keepPracticing = () => {
    reportDispatch({ type: "practice" });
    practiceDispatch({ type: UserActionsEnum.practice });
    setCounter(0);
  };

  const nextLesson = () => {
    reportDispatch({
      type: "nextLesson",
    });
    practiceDispatch({ type: UserActionsEnum.review });
    setCounter(0);
  };

  const nextSubject = () => {
    reportDispatch({
      type: "nextSubject",
    });
    practiceDispatch({ type: UserActionsEnum.review });
    setCounter(0);
  };

  const restartCourse = () => {
    reportDispatch({
      type: "initialState",
      props: defaultSRSObj,
    });
    practiceDispatch({ type: UserActionsEnum.review });
    setCounter(0);
    saveReport({ studentId, report: JSON.stringify(defaultSRSObj) });
  };

  const Next = () => {
    return (
      <Group justify="center">
        {reportState.wrong.length ? (
          <Button autoFocus onClick={keepPracticing}>
            Keep Practicing
          </Button>
        ) : reportState.lesson <= maxPerLesson ? (
          <Button autoFocus onClick={nextLesson}>
            Next Lesson ({reportState.lesson + 1}'s)
          </Button>
        ) : findNextSubject(reportState.subject) ? (
          <Button autoFocus onClick={nextSubject}>
            Next Subject ({findNextSubject(reportState.subject)})
          </Button>
        ) : (
          <Stack>
            <Text>Course Completed</Text>
            <Button autoFocus onClick={restartCourse}>
              Restart Course
            </Button>
          </Stack>
        )}
      </Group>
    );
  };

  if (!reportState.currentSet.length) {
    return <Next />;
  }

  if (reportState.testing) {
    return (
      <Stack align="center">
        <Text>
          Your results were:
          {` ${reportState.right.length} / ${reportState.learningSet.length}`}
        </Text>
        <Next />
      </Stack>
    );
  } else {
    return (
      <Stack align="center">
        {reportState.wrong.length ? (
          <Text>
            We've done a lot of practicing, I think you are ready for the quiz.
            If not lets practice some more.
          </Text>
        ) : (
          <Text>
            You've successfully ran through all the practice problems. Lets take
            the quiz.
          </Text>
        )}
        <Group justify="center" mt="lg">
          <Button autoFocus onClick={startQuiz}>
            Start Quiz
          </Button>
          {reportState.wrong.length && (
            <Button onClick={keepPracticing}>Keep Practicing</Button>
          )}
        </Group>
      </Stack>
    );
  }
};
