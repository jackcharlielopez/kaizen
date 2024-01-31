import { SRSModel, maxPerLesson, midLesson } from "@/@types/srs.model";
import { StudentSessionStatusEnum } from "@/@types/user-status.model";
import { StudentReportContext } from "@/app/_store/StudentReport.store";
import { StudentSessionContext } from "@/app/_store/StudentSession.store";
import { AccountContext } from "@/app/accounts/layout";
import { Button, Text, Container, Group } from "@mantine/core";
import { useContext } from "react";

export const StudentHome = () => {
  const { name } = useContext<any>(AccountContext);
  const { dispatch } = useContext<any>(StudentSessionContext);
  const { state: reportState } = useContext<any>(StudentReportContext);

  const startAssessment = () => {
    dispatch({ type: StudentSessionStatusEnum.start });
  };

  const getMessage = () => {
    if (reportState.lesson === midLesson) {
      return `Today we are going to practice all the numbers we have learned so far (1 - ${midLesson})`;
    } else if (reportState.lesson === maxPerLesson) {
      return `Today we are going to practice all the numbers we have learned for this entire sequence, (1 - ${maxPerLesson})`;
    } else {
      return `Today we are going to focus on ${reportState.subject}
            ${reportState.lesson}'s. When you are ready click start below`;
    }
  };

  if (reportState) {
    return (
      <Container bg="white" w="65%" p={"lg"} mt="auto" mb="auto">
        <Text size={"xl"}>Hi, {name}</Text>
        <Text>{getMessage()}</Text>
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
