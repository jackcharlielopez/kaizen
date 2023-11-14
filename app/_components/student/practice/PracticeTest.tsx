import { UserActionsEnum } from "@/@types/user-status.model";
import { Group, Button, Text, Stack } from "@mantine/core";
import { useContext } from "react";
import { findNextSubject } from "@/@types/srs.model";
import { StudentReportContext } from "@/app/_store/StudentReport.store";
import { PracticeSessionContext } from "@/app/_store/PracticeSession.store";

export const PracticeTest = ({ setCounter }: { setCounter: any }) => {
  const maxPerLesson = 9;

  const { state: reportState, dispatch: reportDispatch } =
    useContext<any>(StudentReportContext);

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
          <Text>Course Completed</Text>
        )}
      </Group>
    );
  };

  if (!reportState.currentSet.length) {
    return (
      <>
        <Text>No Data Found in Current Set</Text>
        <Next />
      </>
    );
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
