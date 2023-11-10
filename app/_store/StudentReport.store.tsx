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
    case "nextLesson":
      const lesson = state.lesson + 1;
      const learningSet = generateLearningSet(state.subject, lesson);

      return {
        ...state,
        lesson,
        right: [],
        wrong: [],
        test: false,
        learningSet,
        currentSet: learningSet,
      };
    case "nextIteration":
      const iterations = state.iterations + 1;

      return {
        ...state,
        iterations,
        right: [],
        wrong: [],
        test: false,
        currentSet: state.wrong,
      };
    case "quiz":
      return {
        ...state,
        test: true,
        right: [],
        wrong: [],
        currentSet: shuffleArr(state.learningSet),
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
      const nextlesson = 1;
      const subject = findNextSubject(state.subject);

      const nextlearningSet = subject
        ? generateLearningSet(subject, nextlesson)
        : [];

      return {
        ...state,
        subject,
        iterations: 0,
        lesson: nextlesson,
        right: [],
        wrong: [],
        learningSet: nextlearningSet,
        currentSet: nextlearningSet,
        test: false,
      };
    case "practice":
      return {
        ...state,
        right: [],
        wrong: [],
        test: false,
        currentSet: state.learningSet,
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
