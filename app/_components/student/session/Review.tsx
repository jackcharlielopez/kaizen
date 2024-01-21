import { subjectValues } from "@/@types/srs.model";
import { UserActionsEnum } from "@/@types/user-status.model";
import { PracticeSessionContext } from "@/app/_store/PracticeSession.store";
import { StudentReportContext } from "@/app/_store/StudentReport.store";
import { Center, Grid, Button, Text } from "@mantine/core";
import { useContext, useState } from "react";
import { Question } from "./Question";

export const Review = () => {
  const { state: reportState, dispatch: reportDispatch } =
    useContext<any>(StudentReportContext);

  const [reviewState, setReviewState] = useState("all");

  const { dispatch: practiceDispatch } = useContext<any>(
    PracticeSessionContext
  );
  const colSpan = 4;
  let row = 1;

  const [counter, setCounter] = useState(0);

  const startPracticing = () => {
    reportDispatch({ type: "practice" });
    practiceDispatch({ type: UserActionsEnum.practice });
  };

  const ReviewEach = () => {
    return (
      <>
        <Question
          qandA={reportState.learningSet[counter]}
          counter={counter}
          setCounter={setCounter}
        />
        {reportState.learningSet.length - 1 === counter && (
          <Button autoFocus onClick={startPracticing}>
            Start Practicing
          </Button>
        )}
      </>
    );
  };

  const ReviewAll = () => {
    return (
      <>
        <Center w={"100%"}>
          <Text size={"xl"}>Lesson Review</Text>
        </Center>
        <Grid gutter="md" grow>
          {reportState.learningSet.map((val: subjectValues, i: number) => (
            <Grid.Col
              span={colSpan}
              key={Math.random()}
              order={getOrder(i + 1)}
            >
              <Center>
                <Text size={"xl"}>{`${val.problem} = ${val.solution}`}</Text>
              </Center>
            </Grid.Col>
          ))}
        </Grid>
        <Button autoFocus onClick={() => setReviewState("each")}>
          Start Review
        </Button>
      </>
    );
  };

  const getOrder = (index: number) => {
    const totalPerRow = 12 / colSpan;
    const position = index - totalPerRow * (row - 1);

    const coordinates = [row, position];

    if (position >= totalPerRow) {
      row++;
    }

    const newPosition = totalPerRow * (coordinates[1] - 1) + coordinates[0];

    return newPosition - 1;
  };

  const Body = () => {
    switch (reviewState) {
      case "each":
        return <ReviewEach />;
      default:
        return <ReviewAll />;
    }
  };

  return Body();
};
