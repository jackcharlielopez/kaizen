import {
  OOOEnum,
  OOOValues,
  SRSModel,
  defaultSRSObj,
} from "@/@types/srs.model";
import { Dispatch, createContext, useReducer } from "react";

interface StudentReportContext {
  state: SRSModel;
  dispatch: Dispatch<{ type: string; props: any }>;
}

const initialState: SRSModel = defaultSRSObj;

const StudentReportReducer = (
  state: SRSModel,
  action: { type: string; props: OOOValues }
) => {
  switch (action.type) {
    case "nextSection":
      return {
        ...state,
        currentSection: state.currentSection + 1,
        right: [],
        wrong: [],
        test: false,
      };
    case "nextIteration":
      return {
        ...state,
        iterations: state.iterations + 1,
        right: [],
        wrong: [],
        test: false,
      };
    case "quiz":
      return {
        ...state,
        test: true,
        right: [],
        wrong: [],
      };
    case "wrong":
      return {
        ...state,
        wrong: [...state.wrong, action.props],
      };
    case "right":
      return {
        ...state,
        right: [...state.right, action.props],
      };
    case "reset":
      return {
        ...defaultSRSObj,
      };
    case "nextSubject":
      const subjects = Object.values(OOOEnum);
      const index = subjects.findIndex(state.OOO);
      const OOO = index + 1 < subjects.length && subjects[index + 1];

      return {
        ...state,
        OOO,
        iterations: 0,
        currentSection: 1,
        right: [],
        wrong: [],
        test: false,
      };
    default:
      return state;
  }
};

export const StudentReportContext = createContext<StudentReportContext | null>(
  null
);

export const StudentReportProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(StudentReportReducer, initialState);

  return (
    <StudentReportContext.Provider value={{ state, dispatch }}>
      {children}
    </StudentReportContext.Provider>
  );
};
