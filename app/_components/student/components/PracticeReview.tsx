import { subjectValues } from "@/@types/srs.model";
import { UserActionsEnum } from "@/@types/user-status.model";
import { PracticeSessionContext } from "@/app/_store/PracticeSession.store";
import { StudentReportContext } from "@/app/_store/StudentReport.store";
import { Center, Grid, Button, Text } from "@mantine/core";
import { useContext } from "react";

export const PracticeReview = () => {
  const { state: reportState, dispatch: reportDispatch } =
    useContext<any>(StudentReportContext);

  const { dispatch: practiceDispatch } = useContext<any>(
    PracticeSessionContext
  );
  const colSpan = 4;
  let row = 1;

  const startPracticing = () => {
    reportDispatch({ type: "practice" });
    practiceDispatch({ type: UserActionsEnum.practice });
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

  return (
    <>
      <Center w={"100%"}>
        <Text size={"xl"}>Lesson Review</Text>
      </Center>
      <Grid gutter="md" grow>
        {reportState.learningSet.map((val: subjectValues, i: number) => (
          <Grid.Col span={colSpan} key={Math.random()} order={getOrder(i + 1)}>
            <Center>
              <Text size={"xl"}>{`${val.problem} = ${val.solution}`}</Text>
            </Center>
          </Grid.Col>
        ))}
      </Grid>
      <Button autoFocus onClick={startPracticing}>
        Start Practice
      </Button>
    </>
  );
};