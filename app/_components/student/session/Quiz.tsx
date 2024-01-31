import { UserActionsEnum } from "@/@types/user-status.model";
import { Group, Button, Text, Stack, Space } from "@mantine/core";
import { useContext, useEffect, useState } from "react";
import {
  defaultSRSObj,
  findNextSubject,
  maxPerLesson,
  midLesson,
} from "@/@types/srs.model";
import { StudentReportContext } from "@/app/_store/StudentReport.store";
import { PracticeSessionContext } from "@/app/_store/PracticeSession.store";
import { trpc } from "@/app/_trpc/client";
import { Question } from "./Question";
import { AccountContext } from "@/app/accounts/layout";

export const Quiz = () => {
  const { id: studentId } = useContext<any>(AccountContext);
  const { state: reportState, dispatch: reportDispatch } =
    useContext<any>(StudentReportContext);

  const { mutate: saveReport } = trpc.saveStudentReport.useMutation();

  const { dispatch: practiceDispatch } = useContext<any>(
    PracticeSessionContext
  );

  const [startTime] = useState(Date.now());
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    // show user results and save user report
    if (counter === reportState.learningSet.length) {
      let elapsedTime =
        startTime > 0 ? Math.round((Date.now() - startTime) / 1000) : 0;
      saveReport({
        studentId,
        report: JSON.stringify(reportState),
        elapsedTime,
      });
    }
  }, [counter]);

  const keepPracticing = () => {
    reportDispatch({ type: "practice" });
    practiceDispatch({ type: UserActionsEnum.practice });
  };

  const midReview = () => {
    reportDispatch({
      type: "midExam",
    });
    practiceDispatch({ type: UserActionsEnum.review });
  };

  const finalExam = () => {
    reportDispatch({
      type: "finalExam",
    });
    practiceDispatch({ type: UserActionsEnum.review });
  };

  const nextLesson = () => {
    reportDispatch({
      type: "nextLesson",
    });
    practiceDispatch({ type: UserActionsEnum.review });
  };

  const nextSubject = () => {
    reportDispatch({
      type: "nextSubject",
    });
    practiceDispatch({ type: UserActionsEnum.review });
  };

  const restartCourse = () => {
    reportDispatch({
      type: "initialState",
      props: defaultSRSObj,
    });
    practiceDispatch({ type: UserActionsEnum.review });
    saveReport({ studentId, report: JSON.stringify(defaultSRSObj) });
  };

  const Next = () => {
    return (
      <Group justify="center">
        {reportState.wrong.length ? (
          <Button autoFocus onClick={keepPracticing}>
            Restart Practice
          </Button>
        ) : reportState.lesson < maxPerLesson ? (
          reportState.lesson === midLesson ? (
            <Button autoFocus onClick={midReview}>
              Mid-Review (1 - {midLesson})
            </Button>
          ) : (
            <Button autoFocus onClick={nextLesson}>
              Next Lesson ({reportState.lesson + 1}&apos;s)
            </Button>
          )
        ) : reportState.lesson === maxPerLesson ? (
          <Button autoFocus onClick={finalExam}>
            Final Exam (1 - {maxPerLesson})
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

  // catch the situation where the set is empty
  if (!reportState.currentSet.length) return <Next />;

  if (counter === reportState.learningSet.length) {
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
      <Question
        qandA={reportState.learningSet[counter]}
        counter={counter}
        setCounter={setCounter}
      />
    );
  }
};
