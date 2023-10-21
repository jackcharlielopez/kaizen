import { Box, Flex, Paper, Text } from "@mantine/core";
import { useContext } from "react";
import { AccountContext } from "../accounts/layout";

const Student = () => {
  let { id } = useContext(AccountContext);

  return (
    <Flex justify={"center"} align={"center"} h={"calc(100vh - 165px"}>
      <Paper w={"65%"} shadow="md" withBorder p="xl" h={"50%"}>
        <Text>flash card</Text>
      </Paper>
    </Flex>
  );
};

export default Student;