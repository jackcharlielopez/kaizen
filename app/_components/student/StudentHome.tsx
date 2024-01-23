import { SRSModel } from "@/@types/srs.model";
import { StudentSessionStatusEnum } from "@/@types/user-status.model";
import { StudentSessionContext } from "@/app/_store/StudentSession.store";
import { Button, Text, Container, Group } from "@mantine/core";
import { useContext } from "react";

export const StudentHome = ({
  name,
  id,
  initialState,
}: {
  name: string;
  id: string;
  initialState: SRSModel;
}) => {
  const { dispatch } = useContext<any>(StudentSessionContext);

  const startAssessment = () => {
    dispatch({ type: StudentSessionStatusEnum.start });
  };

  console.log(name, id, initialState);

  if (initialState) {
    return (
      <Container bg="white" w="65%" p={"lg"} mt="auto" mb="auto">
        <Text size={"xl"}>Hi, {name}</Text>
        <Text>
          Today we are going to focus on {initialState.subject}
          {initialState.lesson}'s. When you are ready click start below
        </Text>
        <Group justify="center">
          <Button autoFocus onClick={startAssessment} mt="lg">
            Start
          </Button>
        </Group>
      </Container>
    );
  } else {
    return "Loading";
  }
};
