import { trpc } from "@/app/_trpc/client";
import { AccountContext } from "@/app/accounts/layout";
import { Flex, Tabs, Text } from "@mantine/core";
import { useContext } from "react";

const Parent = () => {
  let { id, students } = useContext(AccountContext);

  const GetStudentData = (studentId: string) => {
    const { data: studentData } = trpc.getStudentReports.useQuery({
      studentId,
    });

    console.log(studentData);
    return JSON.stringify(studentData);
  };

  return (
    <Flex justify={"center"} mt="xl">
      <Tabs
        bg={"white"}
        variant="outline"
        defaultValue={students ? students[0].id : "new student"}
        w={"65%"}
        p="sm"
      >
        <Tabs.List>
          {students?.map((student: { id: string; name: string }) => {
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

        {students?.map((student: { id: string; name: string }) => {
          return (
            <Tabs.Panel key={student.id} value={student.id} p="sm">
              {GetStudentData(student.id)}
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
