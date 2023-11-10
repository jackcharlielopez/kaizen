import {
  subjectValues,
  SRSModel,
  defaultSRSObj,
  findNextSubject,
  shuffleArr,
  generateLearningSet,
} from "@/@types/srs.model";
import { Dispatch, createContext, useReducer } from "react";

interface StudentReportContext {
  state: SRSModel;
  dispatch: Dispatch<{ type: string; props: any }>;
}

const initialState: SRSModel = defaultSRSObj;

const StudentReportReducer = (
  state: SRSModel,
  action: { type: string; props: subjectValues }
) => {
  switch (action.type) {
    case "nextSubject":
      const subject = findNextSubject(state.subject);
      const nextlearningSet = subject ? generateLearningSet(subject, 1) : [];

      return {
        ...state,
        subject,
        right: [],
        wrong: [],
        iterations: 0,
        lesson: 1,
        learningSet: nextlearningSet,
        currentSet: nextlearningSet,
        testing: false,
      };
    case "nextLesson":
      const lesson = state.lesson + 1;
      const learningSet = generateLearningSet(state.subject, lesson);

      return {
        ...state,
        right: [],
        wrong: [],
        iterations: 0,
        lesson,
        testing: false,
        learningSet,
        currentSet: learningSet,
      };
    case "quiz":
      return {
        ...state,
        right: [],
        wrong: [],
        iterations: 0,
        testing: true,
        currentSet: shuffleArr(state.learningSet),
      };
    case "practice":
      return {
        ...state,
        right: [],
        wrong: [],
        iterations: 0,
        testing: false,
        currentSet: state.wrong.length ? state.wrong : state.learningSet,
      };
    case "iterate":
      const iterations = state.iterations + 1;
      return {
        ...state,
        right: [],
        wrong: [],
        iterations,
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
    default:
      return throwErr();
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
function throwErr() {
  throw new Error("Function not implemented.");
}
