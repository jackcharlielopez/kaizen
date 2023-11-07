import { subjectValues } from "@/@types/srs.model";
import { Group, Text, Input, Center } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useContext } from "react";
import { useFocusTrap } from "@mantine/hooks";
import { StudentReportContext } from "@/app/_store/StudentReport.store";

export const PracticeQuestion = ({
  qandA,
  counter,
  setCounter,
}: {
  qandA: subjectValues;
  counter: number;
  setCounter: any;
}) => {
  const { dispatch: reportDispatch } = useContext(StudentReportContext);

  // Focus on the input field
  const focusTrapRef = useFocusTrap();

  // Form for the input field
  const form = useForm({
    initialValues: {
      answer: "",
    },
  });

  // short hand to get answer from form
  const answer = () => {
    return form.getInputProps("answer");
  };

  const onKeyEnter = (e: { key: string }) => {
    if (e.key === "Enter") {
      if (qandA.solution === Number(answer().value)) {
        reportDispatch({
          type: "right",
          props: qandA,
        });
      } else {
        reportDispatch({
          type: "wrong",
          props: qandA,
        });
      }
      setCounter(counter + 1);
      form.reset();
    }
  };

  if (qandA) {
    return (
      <Center>
        <Group>
          <Text size="120px">{qandA.problem} = </Text>
          <Input
            ref={focusTrapRef}
            w={200}
            size="120px"
            type="number"
            {...form.getInputProps("answer")}
            onKeyDown={onKeyEnter}
          />
        </Group>
      </Center>
    );
  }
};
