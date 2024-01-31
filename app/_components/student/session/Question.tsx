import { subjectValues } from "@/@types/srs.model";
import { Group, Text, Center, Button, TextInput } from "@mantine/core";
import { useContext, useEffect, useState } from "react";
import { useFocusTrap } from "@mantine/hooks";
import { StudentReportContext } from "@/app/_store/StudentReport.store";
import { PracticeSessionContext } from "@/app/_store/PracticeSession.store";
import { UserActionsEnum } from "@/@types/user-status.model";
import { trpc } from "@/app/_trpc/client";
import { AccountContext } from "@/app/accounts/layout";

export const Question = ({
  qandA,
  counter,
  setCounter,
}: {
  qandA: subjectValues;
  counter: number;
  setCounter: any;
}) => {
  const { state: reportState, dispatch: reportDispatch } =
    useContext<any>(StudentReportContext);
  const { state: status } = useContext<any>(PracticeSessionContext);

  // Focus on the input field
  const focusTrapRef = useFocusTrap();

  // Form for the input field
  const [value, setValue] = useState("");

  const onKeyEnter = (e: any) => {
    if (!value) return;

    if (e.key === "Enter") {
      e.stopPropagation();
      e.preventDefault();
      if (qandA.solution === Number(value)) {
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
      setValue("");
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
            autoFocus
            variant="filled"
            onClick={() => setCounter(counter + 1)}
            disabled={counter === reportState.learningSet.length - 1}
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
          <TextInput
            id="answer"
            ref={focusTrapRef}
            w={200}
            size="120px"
            type="number"
            value={value}
            onChange={(event) => setValue(event.currentTarget.value)}
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
