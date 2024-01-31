import { StudentSessionStatusEnum } from "@/@types/user-status.model";
import { StudentSessionContext } from "@/app/_store/StudentSession.store";
import { Button, Text } from "@mantine/core";
import { useContext } from "react";
import { AccountContext } from "../layout";

export const Student = () => {
  const { dispatch } = useContext<any>(StudentSessionContext);
  let { name } = useContext(AccountContext);

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
