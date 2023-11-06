import { subjectValues } from "@/@types/srs.model";
import { UserActionsEnum } from "@/@types/user-status.model";
import { PracticeSessionContext } from "@/app/_store/PracticeSession.store";
import { Center, Grid, Button, Text } from "@mantine/core";
import { useContext } from "react";

export const PracticeReview = ({ setLearningSet, generatedLearningSet }) => {
  const { dispatch: practiceDispatch } = useContext(PracticeSessionContext);

  const startPracticing = () => {
    setLearningSet(generatedLearningSet);
    practiceDispatch({ type: UserActionsEnum.practice });
  };

  return (
    <>
      <Center w={"100%"}>
        <Text size={"xl"}>Lesson Review</Text>
      </Center>
      <Grid grow gutter="xs">
        {generatedLearningSet.map((val: subjectValues) => (
          <Grid.Col span={4} key={Math.random()}>
            <Center>
              <Text size={"xl"}>{`${val.problem} = ${val.solution}`}</Text>
            </Center>
          </Grid.Col>
        ))}
      </Grid>
      <Button onClick={startPracticing}>Start Practice</Button>
    </>
  );
};
