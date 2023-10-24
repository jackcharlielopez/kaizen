import {
  ActionIcon,
  Button,
  Center,
  RingProgress,
  Text,
  rem,
} from "@mantine/core";
import { IconCheck, IconPlayerPause } from "@tabler/icons-react";
import { useEffect, useState } from "react";

export enum TimerStatus {
  start,
  stop,
  finished,
}

export const Timer = ({ lengthOfTime }: { lengthOfTime: number }) => {
  const [timerStatus, setTimerStatus] = useState<TimerStatus>(
    TimerStatus.start
  );
  const [timer, setTimer] = useState(lengthOfTime);

  // get timer to count down
  useEffect(() => {
    if (timerStatus !== TimerStatus.start) return;

    if (timer === 0) {
      setTimerStatus(TimerStatus.finished);
      return;
    }

    const interval = setInterval(() => {
      setTimer(timer - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, timerStatus]);
  // get timer to count down

  const getLabel = () => {
    switch (timerStatus) {
      case TimerStatus.start:
        return (
          <Text c="blue" fw={700} ta="center" size="xl">
            {timer}
          </Text>
        );
      case TimerStatus.stop:
        return (
          <Center>
            <ActionIcon color="teal" variant="light" radius="xl" size="xl">
              <IconPlayerPause style={{ width: rem(22), height: rem(22) }} />
            </ActionIcon>
          </Center>
        );
      case TimerStatus.finished:
        return (
          <Center>
            <ActionIcon color="teal" variant="light" radius="xl" size="xl">
              <IconCheck style={{ width: rem(22), height: rem(22) }} />
            </ActionIcon>
          </Center>
        );
    }
  };

  const toggleTimer = () => {
    if (timerStatus === TimerStatus.finished) return;

    if (timerStatus === TimerStatus.start) {
      setTimerStatus(TimerStatus.stop);
    } else {
      setTimerStatus(TimerStatus.start);
    }
  };

  return (
    <RingProgress
      onClick={toggleTimer}
      size={200}
      thickness={25}
      sections={[{ value: (timer / lengthOfTime) * 100, color: "blue" }]}
      label={getLabel()}
    />
  );
};
