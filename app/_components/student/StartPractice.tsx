import { ActionIcon, Stack } from "@mantine/core";
import { useContext, useEffect, useMemo, useState } from "react";
import { UserActionsEnum } from "@/@types/user-status.model";
import { PracticeQuestion } from "./practice/PracticeQuestion";
import { IconArrowBackUp, IconHelpCircle } from "@tabler/icons-react";
import { PracticeTest } from "./practice/PracticeTest";
import { PracticeReview } from "./practice/PracticeReview";
import { PracticeHelp } from "./practice/PracticeHelp";
import { StudentReportContext } from "@/app/_store/StudentReport.store";
import { PracticeSessionContext } from "@/app/_store/PracticeSession.store";

export const StartPractice = () => {
  const { state: report, dispatch: reportDispatch } =
    useContext<any>(StudentReportContext);

  const {
    state: { status, previousStatus },
    dispatch: practiceDispatch,
  } = useContext<any>(PracticeSessionContext);

  const [counter, setCounter] = useState(
    report.wrong.length + report.right.length
  );

  // handles user flow when user completes a set
  useEffect(() => {
    if (report.learningSet.length) {
      if (counter < report.currentSet.length) {
        return;
      }

      if (report.iterations === 2) {
        practiceDispatch({ type: UserActionsEnum.test });
        return;
      }

      if (counter === report.currentSet.length && report.testing) {
        practiceDispatch({ type: UserActionsEnum.test });
        return;
      }

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
  }, [counter]);

  const getHelpMessage = () => {
    return previousStatus === UserActionsEnum.review
      ? JSON.stringify(report.learningSet)
      : JSON.stringify(report.currentSet[counter]);
  };

  const Body = () => {
    switch (status) {
      case UserActionsEnum.help:
        return PracticeHelp(getHelpMessage());
      case UserActionsEnum.test:
        return PracticeTest({
          setCounter,
        });
      case UserActionsEnum.review:
        return PracticeReview();
      default:
        return (
          <PracticeQuestion
            qandA={report.currentSet[counter]}
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
        <ActionIcon
          autoFocus
          style={{ alignSelf: "end" }}
          size="xl"
          onClick={goBack}
        >
          <IconArrowBackUp />
        </ActionIcon>
      ) : (
        <ActionIcon style={{ alignSelf: "end" }} size="xl" onClick={getHelp}>
          <IconHelpCircle />
        </ActionIcon>
      )}
      <Stack align="center" justify="center" h={"100%"} w={"100%"} mt="-44px">
        {useMemo(
          () => (
            <Body />
          ),
          [status, counter]
        )}
      </Stack>
    </>
  );
};
