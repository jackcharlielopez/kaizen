import { StudentSessionStatusEnum } from "@/@types/user-status.model";
import { StudentSessionContext } from "@/app/_store/StudentSession.store";
import { Button, Text } from "@mantine/core";
import { useContext } from "react";

export const StudentHome = ({ name }: { name: string }) => {
  const { dispatch } = useContext<any>(StudentSessionContext);

  const startAssessment = () => {
    dispatch({ type: StudentSessionStatusEnum.start });
  };

  return (
    <>
      <Text size={"xl"}>Welcome {name}</Text>
      <Button autoFocus onClick={startAssessment} mt="lg">
        Enter
      </Button>
    </>
  );
};
