import { UserActionsEnum } from "@/@types/user-status.model";
import { Group, Button, Text, Stack } from "@mantine/core";
import { useContext } from "react";
import { findNextSubject, shuffleArr } from "@/@types/srs.model";
import { StudentReportContext } from "@/app/_store/StudentReport.store";
import { PracticeSessionContext } from "@/app/_store/PracticeSession.store";

export const PracticeTest = ({ setCounter }) => {
  const maxPerLesson = 1;

  const { state: reportState, dispatch: reportDispatch } =
    useContext(StudentReportContext);

  const { dispatch: practiceDispatch } = useContext(PracticeSessionContext);

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

  if (reportState.test) {
    return (
      <Stack align="center">
        <Text>
          Your results were:
          {` ${reportState.right.length} / ${reportState.learningSet.length}`}
        </Text>
        <Group justify="center">
          {reportState.wrong.length ? (
            <Button onClick={keepPracticing}>Keep Practicing</Button>
          ) : reportState.lesson <= maxPerLesson ? (
            <Button onClick={nextLesson}>
              Next Lesson ({reportState.lesson + 1}'s)
            </Button>
          ) : findNextSubject(reportState.subject) ? (
            <Button onClick={nextSubject}>
              Next Subject ({findNextSubject(reportState.subject)})
            </Button>
          ) : (
            <Text>Course Completed</Text>
          )}
        </Group>
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
        <Group justify="center">
          <Button onClick={startQuiz}>Start Quiz</Button>
          {reportState.wrong.length && (
            <Button onClick={keepPracticing}>Keep Practicing</Button>
          )}
        </Group>
      </Stack>
    );
  }
};
