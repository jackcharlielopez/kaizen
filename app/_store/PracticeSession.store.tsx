import { Dispatch, createContext, useReducer } from "react";
import { UserActionsEnum } from "@/@types/user-status.model";

interface PracticeSessionContext {
  state: PracticeSessionState;
  dispatch: Dispatch<{ type: UserActionsEnum }>;
}

interface PracticeSessionState {
  status: UserActionsEnum;
  previousStatus: UserActionsEnum;
}

const initialState: PracticeSessionState = {
  status: UserActionsEnum.review,
  previousStatus: UserActionsEnum.review,
};

const PracticeSessionReducer = (
  state: PracticeSessionState,
  action: { type: UserActionsEnum }
) => {
  switch (action.type) {
    case UserActionsEnum.quiz:
      return {
        ...state,
        status: UserActionsEnum.quiz,
        previousStatus: state.status,
      };
    case UserActionsEnum.practice:
      return {
        ...state,
        status: UserActionsEnum.practice,
        previousStatus: state.status,
      };
    case UserActionsEnum.help:
      return {
        ...state,
        status: UserActionsEnum.help,
        previousStatus: state.status,
      };
    case UserActionsEnum.review:
      return {
        ...state,
        status: UserActionsEnum.review,
        previousStatus: state.status,
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
