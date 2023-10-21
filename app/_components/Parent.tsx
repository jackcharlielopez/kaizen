import { Container, Flex } from "@mantine/core";
import { useContext } from "react";
import { AccountContext } from "../accounts/layout";

const Parent = () => {
  let { id } = useContext(AccountContext);

  return (
    <Flex justify={"space-between"}>
      <Container w={"35%"}>Account and Credit Card</Container>

      <Container w={"65%"}>
        Student tabs, student form, student progress
      </Container>
    </Flex>
  );
};

export default Parent;
