import { AccountContext } from "@/app/accounts/layout";
import { Flex, Tabs } from "@mantine/core";
import { useContext } from "react";

const Parent = () => {
  let { id, students } = useContext(AccountContext);

  console.log(students);

  return (
    <Flex justify={"center"} mt="xl">
      <Tabs
        bg={"white"}
        variant="outline"
        defaultValue={students[0].id}
        w={"65%"}
        p="sm"
      >
        <Tabs.List>
          {students.map((student: { id: string; name: string }) => {
            return (
              <Tabs.Tab key={student.id} value={student.id}>
                {student.name.split(" ")[0]}
              </Tabs.Tab>
            );
          })}
          <Tabs.Tab value="new student">+ Student</Tabs.Tab>

          <Tabs.Tab value="account" ml="auto">
            Account
          </Tabs.Tab>
        </Tabs.List>

        {students.map((student: { id: string; name: string }) => {
          return (
            <Tabs.Panel key={student.id} value={student.id} p="sm">
              {student.name}
            </Tabs.Panel>
          );
        })}

        <Tabs.Panel value="new student" p="sm">
          add new student
        </Tabs.Panel>
        <Tabs.Panel value="account" p="sm">
          account
        </Tabs.Panel>
      </Tabs>
    </Flex>
  );
};

export default Parent;
