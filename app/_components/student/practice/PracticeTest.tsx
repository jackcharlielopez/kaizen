import { UserActionsEnum } from "@/@types/user-status.model";
import { Group, Button, Text } from "@mantine/core";
import { useContext } from "react";
import { generateLearningSet, shuffleArr } from "@/@types/srs.model";
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
    setLearningSet(shuffleArr(generatedLearningSet));
    reportDispatch({ type: "quiz" });
    practiceDispatch({ type: UserActionsEnum.practice });
  };

  const keepPracticing = () => {
    setLearningSet(reportState.wrong);
    reportDispatch({ type: "reset" });
    practiceDispatch({ type: UserActionsEnum.practice });
  };

  // TODO get parent max per set
  // TODO get parent subjects set
  const nextLesson = () => {
    reportDispatch({
      type: "nextIteration",
    });
    generateLearningSet;
    setCounter(0);
  };

  const nextSubject = () => {
    reportDispatch({
      type: "nextSubject",
    });
    generateLearningSet;
    setCounter(0);
  };

  if (reportState.test) {
    return (
      <Group justify="center">
        <Text>
          Your results were: {reportState.right.length} / {learningSet.length}{" "}
        </Text>
        {reportState.wrong.length ? (
          <Button onClick={keepPracticing}>Keep Practicing</Button>
        ) : (
          <Button onClick={nextLesson}>
            Next Lesson ({reportState.currentSection + 1}'s)
          </Button>
        )}
      </Group>
    );
  } else {
    return (
      <Group justify="center">
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
        <Button onClick={startQuiz}>Start Quiz</Button>
        {reportState.wrong.length && (
          <Button onClick={keepPracticing}>Keep Practicing</Button>
        )}
      </Group>
    );
  }
};
