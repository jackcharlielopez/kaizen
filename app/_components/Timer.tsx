import {
  ActionIcon,
  Button,
  Center,
  RingProgress,
  Text,
  rem,
} from "@mantine/core";
import { IconCheck, IconPlayerPause } from "@tabler/icons-react";
import { useContext, useEffect, useState } from "react";
import { StudentSessionStatus } from "./Student";
import {
  StudentSessionStatusContext,
  StudentSessionStatusEnum,
} from "@/@types/user-status.model";

export const Timer = ({ lengthOfTime }: { lengthOfTime: number }) => {
  const { studentSessionStatus, setStudentSessionStatus } =
    useContext<StudentSessionStatusContext | null>(StudentSessionStatus);
  const [timer, setTimer] = useState(lengthOfTime);

  // get timer to count down
  useEffect(() => {
    if (studentSessionStatus !== StudentSessionStatusEnum.start) return;

    if (timer === 0) {
      setStudentSessionStatus(StudentSessionStatusEnum.finished);
      return;
    }

    const interval = setInterval(() => {
      setTimer(timer - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, studentSessionStatus, setStudentSessionStatus]);
  // get timer to count down

  const convertStoMs = () => {
    let minutes = Math.floor(timer / 60);
    let extraSeconds =
      (timer % 60).toString().length == 1 ? "0" + (timer % 60) : timer % 60;

    return minutes + ":" + extraSeconds;
  };

  const toggleTimer = () => {
    if (studentSessionStatus === StudentSessionStatusEnum.finished) return;

    if (studentSessionStatus === StudentSessionStatusEnum.start) {
      setStudentSessionStatus(StudentSessionStatusEnum.stop);
    } else {
      setStudentSessionStatus(StudentSessionStatusEnum.start);
    }
  };

  const Body = () => {
    switch (studentSessionStatus) {
      case StudentSessionStatusEnum.start:
        return (
          <RingProgress
            onClick={() => toggleTimer()}
            size={200}
            thickness={25}
            sections={[{ value: (timer / lengthOfTime) * 100, color: "green" }]}
            label={
              <Text c="green" fw={700} ta="center" size="xl">
                {convertStoMs()}
              </Text>
            }
          />
        );
      case StudentSessionStatusEnum.stop:
        return (
          <RingProgress
            onClick={() => toggleTimer()}
            size={200}
            thickness={25}
            sections={[{ value: (timer / lengthOfTime) * 100, color: "grey" }]}
            label={
              <Center>
                <ActionIcon color="grey" variant="light" radius="xl" size="xl">
                  <IconPlayerPause
                    style={{ width: rem(22), height: rem(22) }}
                  />
                </ActionIcon>
              </Center>
            }
          />
        );
      case StudentSessionStatusEnum.finished:
        return (
          <RingProgress
            size={200}
            thickness={25}
            sections={[{ value: 100, color: "red" }]}
            label={
              <Text c="red" fw={700} ta="center" size="xl">
                Time's Up!
              </Text>
            }
          />
        );
      default:
        return (
          <RingProgress
            size={200}
            thickness={25}
            sections={[{ value: 100, color: "grey" }]}
            label={
              <Text c="grey" fw={700} ta="center" size="xl">
                {convertStoMs()}
              </Text>
            }
          />
        );
    }
  };

  return <Body />;
};
