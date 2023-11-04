import { StudentSessionStatusEnum } from "@/@types/user-status.model";
import { StudentSessionContext } from "@/app/_store/StudentSession.store";
import { Button, Text } from "@mantine/core";
import { useContext } from "react";

export const IntroPractice = ({ name }: { name: string }) => {
  const { dispatch } = useContext(StudentSessionContext);

  const startAssessment = () => {
    dispatch({ type: StudentSessionStatusEnum.start });
  };

  return (
    <>
      <Text size={"xl"}>
        Welcome back {name}. Lets get started on learning!
      </Text>
      <Button onClick={() => startAssessment()}>Start Assessment</Button>
    </>
  );
};
