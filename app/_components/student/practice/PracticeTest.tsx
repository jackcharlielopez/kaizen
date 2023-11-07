import { UserActionsEnum } from "@/@types/user-status.model";
import { Group, Button, Text, Stack } from "@mantine/core";
import { useContext } from "react";
import { findNextSubject, shuffleArr } from "@/@types/srs.model";
import { StudentReportContext } from "@/app/_store/StudentReport.store";
import { PracticeSessionContext } from "@/app/_store/PracticeSession.store";

export const PracticeTest = ({
  setLearningSet,
  generatedLearningSet,
  setCounter,
  learningSet,
}) => {
  const { state: reportState, dispatch: reportDispatch } =
    useContext(StudentReportContext);
  const { dispatch: practiceDispatch } = useContext(PracticeSessionContext);

  const startQuiz = () => {
    reportDispatch({ type: "quiz" });
    setLearningSet(shuffleArr(generatedLearningSet));
    practiceDispatch({ type: UserActionsEnum.practice });
    setCounter(0);
  };

  const keepPracticing = () => {
    setLearningSet(reportState.wrong);
    reportDispatch({ type: "reset" });
    practiceDispatch({ type: UserActionsEnum.practice });
    setCounter(0);
  };

  // TODO get parent max per set
  // TODO get parent subjects set
  const nextLesson = () => {
    reportDispatch({
      type: "nextLesson",
    });
    setCounter(0);
    practiceDispatch({ type: UserActionsEnum.review });
  };

  const nextSubject = () => {
    reportDispatch({
      type: "nextSubject",
    });
    setCounter(0);
    practiceDispatch({ type: UserActionsEnum.review });
  };

  if (reportState.test) {
    return (
      <Stack align="center">
        <Text>
          Your results were: {reportState.right.length} / {learningSet.length}{" "}
        </Text>
        <Group justify="center">
          {reportState.wrong.length ? (
            <Button onClick={keepPracticing}>Keep Practicing</Button>
          ) : reportState.lesson <= 9 ? (
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
