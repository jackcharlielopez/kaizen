import { StudentReportContext } from "@/app/_store/StudentReport.store";
import { useContext, useEffect, useState } from "react";
import { Question } from "./Question";
import { UserActionsEnum } from "@/@types/user-status.model";
import { PracticeSessionContext } from "@/app/_store/PracticeSession.store";
import { Stack, Group, Button, Text } from "@mantine/core";

export const Practice = () => {
  const { state: report, dispatch: reportDispatch } =
    useContext<any>(StudentReportContext);

  const { dispatch: practiceDispatch } = useContext<any>(
    PracticeSessionContext
  );

  const [counter, setCounter] = useState(
    report.wrong.length + report.right.length
  );

  const [practiceState, setPracticeState] = useState(true);

  const startQuiz = () => {
    reportDispatch({ type: "quiz" });
    practiceDispatch({ type: UserActionsEnum.test });
  };

  const keepPracticing = () => {
    setPracticeState(true);
    reportDispatch({ type: "practice" });
    setCounter(0);
  };

  const NextQuestion = () => {
    return (
      <Question
        qandA={report.currentSet[counter]}
        counter={counter}
        setCounter={setCounter}
      />
    );
  };

  const PracticeEnd = () => {
    return (
      <Stack align="center">
        {report.wrong.length ? (
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
          {report.wrong.length && (
            <Button onClick={keepPracticing}>Restart Practice</Button>
          )}
        </Group>
      </Stack>
    );
  };

  useEffect(() => {
    // ensure there is a learning set, otherwise test them
    if (report.learningSet.length) {
      // do nothing if user is just moving through set
      if (counter < report.currentSet.length) {
        return;
      }

      // quiz user if they've gone through set 3 times
      if (report.iterations === 2) {
        setPracticeState(false);
        return;
      }

      // iterate again if user didnt answer all questions in practice set, otherwise test them
      if (counter === report.currentSet.length && report.wrong.length) {
        reportDispatch({ type: "iterate" });
        setCounter(0);
      } else {
        setPracticeState(false);
      }
    } else {
      setPracticeState(false);
      return;
    }
  }, [counter]);

  return practiceState ? <NextQuestion /> : <PracticeEnd />;
};
