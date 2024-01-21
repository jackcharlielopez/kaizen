import { subjectValues } from "@/@types/srs.model";
import { Group, Text, Input, Center, Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useContext } from "react";
import { useFocusTrap } from "@mantine/hooks";
import { StudentReportContext } from "@/app/_store/StudentReport.store";
import { PracticeSessionContext } from "@/app/_store/PracticeSession.store";
import { UserActionsEnum } from "@/@types/user-status.model";

export const Question = ({
  qandA,
  counter,
  setCounter,
}: {
  qandA: subjectValues;
  counter: number;
  setCounter: any;
}) => {
  const { state: report, dispatch: reportDispatch } =
    useContext<any>(StudentReportContext);
  const { state: status } = useContext<any>(PracticeSessionContext);

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
    if (!answer().value) return;

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

  const ReviewState = () => {
    return (
      <>
        <Center>
          <Group>
            <Text size="120px">
              {qandA.problem} = {qandA.solution}
            </Text>
          </Group>
        </Center>
        <Group>
          <Button
            variant="filled"
            onClick={() => setCounter(counter - 1)}
            disabled={counter === 0}
          >
            Prev
          </Button>
          <Button
            variant="filled"
            onClick={() => setCounter(counter + 1)}
            disabled={counter === report.learningSet.length - 1}
          >
            Next
          </Button>
        </Group>
      </>
    );
  };

  const DefaultState = () => {
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
  };

  if (qandA) {
    switch (status.status) {
      case UserActionsEnum.review:
        return <ReviewState />;
      default:
        return <DefaultState />;
    }
  }
};
