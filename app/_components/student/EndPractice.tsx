import { StudentReportContext } from "@/app/_store/StudentReport.store";
import { trpc } from "@/app/_trpc/client";
import { Text } from "@mantine/core";
import { useContext } from "react";

export const EndPractice = (studentId: string) => {
  const { state: report } = useContext<any>(StudentReportContext);
  const { mutate: saveReport } = trpc.saveStudentReport.useMutation();

  saveReport({ studentId, report: JSON.stringify(report) });

  return (
    <Text size={"xl"}>
      That's all we have for today. Great job! You got x/y correct
    </Text>
  );
};
