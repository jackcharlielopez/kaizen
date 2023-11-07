import { generateLearningSet } from "@/@types/srs.model";
import { ActionIcon, Stack } from "@mantine/core";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { UserActionsEnum } from "@/@types/user-status.model";
import { PracticeQuestion } from "./practice/PracticeQuestion";
import { IconArrowBackUp, IconHelpCircle } from "@tabler/icons-react";
import { PracticeTest } from "./practice/PracticeTest";
import { PracticeReview } from "./practice/PracticeReview";
import { PracticeHelp } from "./practice/PracticeHelp";
import { StudentReportContext } from "@/app/_store/StudentReport.store";
import { PracticeSessionContext } from "@/app/_store/PracticeSession.store";

export const StartPractice = () => {
  const { state: reportState, dispatch: reportDispatch } =
    useContext(StudentReportContext);

  const {
    state: { status, previousStatus },
    dispatch: practiceDispatch,
  } = useContext(PracticeSessionContext);

  const [generatedLearningSet, setGeneratedLearningSet] = useState(
    generateLearningSet(reportState.subject, reportState.lesson)
  );

  useEffect(() => {
    const updatedLearningSet = generateLearningSet(
      reportState.subject,
      reportState.lesson
    );

    setGeneratedLearningSet(updatedLearningSet);
    setLearningSet(updatedLearningSet);
  }, [reportState.lesson, reportState.subject]);

  const [learningSet, setLearningSet] = useState(generatedLearningSet);
  const [counter, setCounter] = useState(
    reportState.wrong.length + reportState.right.length
  );

  useEffect(() => {
    if (counter < learningSet.length) {
      return;
    }

    if (reportState.iterations === 2) {
      practiceDispatch({ type: UserActionsEnum.test });
      return;
    }

    if (counter === learningSet.length && reportState.test) {
      practiceDispatch({ type: UserActionsEnum.test });
      return;
    }

    if (counter === learningSet.length && reportState.wrong.length) {
      // move learning set to be whatever user got wrong
      setLearningSet(reportState.wrong);
      // clear out the wrong category and update iteration
      reportDispatch({
        type: "nextIteration",
      });
      // restart counter
      setCounter(0);
    } else {
      practiceDispatch({ type: UserActionsEnum.test });
    }
  }, [counter]);

  const Body = () => {
    switch (status) {
      case UserActionsEnum.help:
        return PracticeHelp();
      case UserActionsEnum.test:
        return PracticeTest({
          setLearningSet,
          generatedLearningSet,
          setCounter,
          learningSet,
        });
      case UserActionsEnum.review:
        return PracticeReview({
          generatedLearningSet,
          setLearningSet,
        });
      default:
        return (
          <PracticeQuestion
            qandA={learningSet[counter]}
            counter={counter}
            setCounter={setCounter}
          ></PracticeQuestion>
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
    <>
      {status === UserActionsEnum.help ? (
        <ActionIcon style={{ alignSelf: "end" }} size="xl" onClick={goBack}>
          <IconArrowBackUp />
        </ActionIcon>
      ) : (
        <ActionIcon style={{ alignSelf: "end" }} size="xl" onClick={getHelp}>
          <IconHelpCircle />
        </ActionIcon>
      )}
      <Stack align="center" justify="center" h={"100%"}>
        {useMemo(
          () => (
            <Body />
          ),
          [status, counter, learningSet, setLearningSet]
        )}
      </Stack>
    </>
  );
};
