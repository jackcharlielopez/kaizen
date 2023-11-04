import { Dispatch, createContext, useReducer } from "react";
import { UserActionsEnum } from "@/@types/user-status.model";

interface PracticeSessionContext {
  state: PracticeSessionState;
  dispatch: Dispatch<{ type: UserActionsEnum }>;
}

interface PracticeSessionState {
  status: UserActionsEnum;
}

const initialState: PracticeSessionState = {
  status: UserActionsEnum.review,
};

const PracticeSessionReducer = (
  state: PracticeSessionState,
  action: { type: UserActionsEnum }
) => {
  switch (action.type) {
    case UserActionsEnum.test:
      return {
        ...state,
        status: UserActionsEnum.test,
      };
    case UserActionsEnum.practice:
      return {
        ...state,
        status: UserActionsEnum.practice,
      };
    case UserActionsEnum.help:
      return {
        ...state,
        status: UserActionsEnum.help,
      };
    case UserActionsEnum.review:
      return {
        ...state,
        status: UserActionsEnum.review,
      };
    default:
      return state;
  }
};

export const PracticeSessionContext =
  createContext<PracticeSessionContext | null>(null);

export const PracticeSessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(PracticeSessionReducer, initialState);

  return (
    <PracticeSessionContext.Provider value={{ state, dispatch }}>
      {children}
    </PracticeSessionContext.Provider>
  );
};
