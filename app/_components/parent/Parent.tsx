import { trpc } from "@/app/_trpc/client";
import { AccountContext } from "@/app/accounts/layout";
import { Flex, Tabs, Button } from "@mantine/core";
import { useContext, useEffect, useState } from "react";
import ReportGraph from "./components/ReportGraph";
import AddStudentForm from "./components/AddStudentForm";
import { useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";

const Parent = () => {
  let { id } = useContext(AccountContext);
  const queryClient = useQueryClient();

  const { data: students } = trpc.getStudents.useQuery();

  const [activeTab, setActiveTab] = useState<string | null>(
    students?.length ? students[0].id : "new student"
  );

  const { mutate: getStudentReports, data: studentData } =
    trpc.getStudentReports.useMutation();

  const { mutate: deleteStudentAccount } = trpc.deleteStudent.useMutation({
    onSuccess: (val) => {
      queryClient.invalidateQueries({
        queryKey: [["getStudents"], { type: "query" }],
      });
      notifications.show({
        title: "Student Deleted Successfully",
        message: `${val.name} is now deleted`,
        color: "green",
      });
      setActiveTab("new student");
    },
  });

  function deleteStudent(studentId: string) {
    deleteStudentAccount({ studentId });
  }

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
              <Button
                variant="filled"
                onClick={() => deleteStudent(student.id)}
              >
                Delete Account
              </Button>
              {studentData && <ReportGraph reports={studentData}></ReportGraph>}
            </Tabs.Panel>
          );
        })}

        <Tabs.Panel value="new student" p="sm">
          <AddStudentForm userId={id} />
        </Tabs.Panel>
        <Tabs.Panel value="account" p="sm">
          account
        </Tabs.Panel>
      </Tabs>
    </Flex>
  );
};

export default Parent;
