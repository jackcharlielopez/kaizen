import { OOOValues, SRSModel } from "@/@types/srs.model";
import { Group, Text, Input, Center, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useContext, useState } from "react";
import { StudentPreviousReport } from "./Student";
import { StudentPreviousReportContext } from "@/@types/user-status.model";

export const QuestionAnswer = ({
  qandA,
  counter,
  setCounter,
}: {
  qandA: OOOValues;
  counter: number;
  setCounter: any;
}) => {
  const form = useForm({
    initialValues: {
      answer: "",
    },
  });

  const { studentPreviousReport, setStudentPreviousReport } =
    useContext<StudentPreviousReportContext | null>(StudentPreviousReport);

  const [grade, setGrade] = useState<string | undefined>(undefined);

  const answer = () => {
    return form.getInputProps("answer");
  };

  const onKeyEnter = (e: { key: string }) => {
    if (e.key === "Enter") {
      if (qandA.solution === Number(answer().value)) {
        setGrade("Correct");
        setStudentPreviousReport({
          ...studentPreviousReport,
          right: [...studentPreviousReport.right, qandA],
        });
      } else {
        setGrade("Incorrect");
        setStudentPreviousReport({
          ...studentPreviousReport,
          wrong: [...studentPreviousReport.wrong, qandA],
        });
      }
      setCounter(counter + 1);
      form.reset();
    }
  };

  if (qandA) {
    return (
      <Stack align="center">
        <Center>
          <Group>
            <Text size="120px">{qandA.problem} = </Text>
            <Input
              data-autofocus
              w={200}
              size="120px"
              type="number"
              {...form.getInputProps("answer")}
              onKeyDown={onKeyEnter}
            />
          </Group>
        </Center>
        <Text>{grade}</Text>
      </Stack>
    );
  }
};
