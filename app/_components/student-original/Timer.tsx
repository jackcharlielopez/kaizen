import {
  ActionIcon,
  Button,
  Center,
  RingProgress,
  Text,
  rem,
} from "@mantine/core";
import { IconPlayerPause } from "@tabler/icons-react";
import { useContext, useEffect, useState } from "react";
import {
  StudentSessionStatusEnum,
  UserActionsEnum,
} from "@/@types/user-status.model";
import { StudentSessionContext } from "@/app/_store/StudentSession.store";
import { PracticeSessionContext } from "@/app/_store/PracticeSession.store";

export const Timer = ({ lengthOfTime }: { lengthOfTime: number }) => {
  const {
    state: { status: sessionStatus },
    dispatch,
  } = useContext<any>(StudentSessionContext);

  const {
    state: { status: userStatus, previousStatus },
    dispatch: practiceDispatch,
  } = useContext<any>(PracticeSessionContext);
  const [timer, setTimer] = useState(lengthOfTime);

  // get timer to count down
  useEffect(() => {
    if (
      sessionStatus === StudentSessionStatusEnum.finished ||
      userStatus === UserActionsEnum.help
    )
      return;

    if (timer === 0) {
      dispatch({ type: StudentSessionStatusEnum.finished });
      return;
    }

    const interval = setInterval(() => {
      setTimer(timer - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, sessionStatus, dispatch, userStatus]);
  // get timer to count down

  const convertStoMs = () => {
    let minutes = Math.floor(timer / 60);
    let extraSeconds =
      (timer % 60).toString().length == 1 ? "0" + (timer % 60) : timer % 60;

    return minutes + ":" + extraSeconds;
  };

  const toggleTimer = () => {
    if (sessionStatus === StudentSessionStatusEnum.finished) return;

    if (userStatus !== UserActionsEnum.help) {
      practiceDispatch({ type: UserActionsEnum.help });
    } else {
      practiceDispatch({ type: previousStatus });
    }
  };

  if (sessionStatus === StudentSessionStatusEnum.finished) {
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
  }

  if (userStatus === UserActionsEnum.help) {
    return (
      <RingProgress
        onClick={() => toggleTimer()}
        size={200}
        thickness={25}
        sections={[{ value: (timer / lengthOfTime) * 100, color: "grey" }]}
        label={
          <Center>
            <ActionIcon color="grey" variant="light" radius="xl" size="xl">
              <IconPlayerPause style={{ width: rem(22), height: rem(22) }} />
            </ActionIcon>
          </Center>
        }
      />
    );
  }

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
};
