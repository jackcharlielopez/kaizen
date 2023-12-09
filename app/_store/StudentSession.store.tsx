import { Dispatch, createContext, useReducer } from "react";
import { StudentSessionStatusEnum } from "@/@types/user-status.model";

interface StudentSessionContext {
  state: { status: StudentSessionStatusEnum };
  dispatch: Dispatch<{ type: StudentSessionStatusEnum }>;
}

interface StudentSessionState {
  status: StudentSessionStatusEnum;
}

const initialState: StudentSessionState = {
  status: StudentSessionStatusEnum.default,
};

const StudentSessionReducer = (
  state: StudentSessionState,
  action: { type: StudentSessionStatusEnum }
) => {
  switch (action.type) {
    case StudentSessionStatusEnum.start:
      return {
        ...state,
        status: StudentSessionStatusEnum.start,
      };
    case StudentSessionStatusEnum.finished:
      return {
        ...state,
        status: StudentSessionStatusEnum.finished,
      };
    default:
      return {
        ...state,
        status: StudentSessionStatusEnum.default,
      };
  }
};

export const StudentSessionContext =
  createContext<StudentSessionContext | null>(null);

export const StudentSessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(StudentSessionReducer, initialState);

  return (
    <StudentSessionContext.Provider value={{ state, dispatch }}>
      {children}
    </StudentSessionContext.Provider>
  );
};
