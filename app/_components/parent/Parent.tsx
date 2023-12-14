import { trpc } from "@/app/_trpc/client";
import { AccountContext } from "@/app/accounts/layout";
import { Flex, Tabs, Text } from "@mantine/core";
import { useContext, useEffect, useState } from "react";
import ReportGraph from "./components/ReportGraph";

const Parent = () => {
  let { id, students } = useContext(AccountContext);
  const [activeTab, setActiveTab] = useState<string | null>(
    students?.length ? students[0].id : "new student"
  );

  const { mutate: getStudentReports, data: studentData } =
    trpc.getStudentReports.useMutation();

  useEffect(() => {
    if (!activeTab || activeTab === "new student" || activeTab === "account")
      return;

    getStudentReports({ studentId: activeTab });
  }, [activeTab]);

  return (
    <Flex justify={"center"} mt="xl">
      <Tabs
        bg={"white"}
        variant="outline"
        value={activeTab}
        onChange={setActiveTab}
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
              {studentData && <ReportGraph reports={studentData}></ReportGraph>}
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
