import { SRSModel } from "@/@types/srs.model";
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

  if (reportState) {
    return (
      <Container bg="white" w="65%" p={"lg"} mt="auto" mb="auto">
        <Text size={"xl"}>Hi, {name}</Text>
        <Text>
          Today we are going to focus on {reportState.subject}
          {reportState.lesson}'s. When you are ready click start below
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
