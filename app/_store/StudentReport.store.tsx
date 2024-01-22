import {
  subjectValues,
  SRSModel,
  defaultSRSObj,
  findNextSubject,
  shuffleArr,
  generateLearningSet,
  maxPerLesson,
} from "@/@types/srs.model";
import { Dispatch, createContext, useReducer } from "react";

interface StudentReportContext {
  state: SRSModel;
  dispatch: Dispatch<{ type: string; props: any }>;
}

const initialState: SRSModel = defaultSRSObj;

const StudentReportReducer = (
  state: SRSModel,
  action: { type: string; props: any }
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
        currentSet: state.learningSet,
      };
    case "iterate":
      const iterations = state.iterations + 1;
      return {
        ...state,
        right: [],
        wrong: [],
        iterations,
        currentSet: state.wrong,
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
    case "initialState":
      let newLearningSet: subjectValues[];
      let newLesson = action.props.lesson;
      let newSubject = action.props.subject;

      // if previous save wasnt a test then just return what is saved
      if (!action.props.testing) {
        return action.props;
      } else {
        // if user has gotten wrong answers repeat practice
        if (action.props.wrong.length) {
          newLearningSet = generateLearningSet(
            action.props.subject,
            action.props.lesson
          );
        } else {
          // if no wrong answer get next lesson, ensure next lesson exists or move to next subject
          if (action.props.lesson <= maxPerLesson) {
            newLesson = action.props.lesson + 1;
            newLearningSet = generateLearningSet(
              action.props.subject,
              newLesson
            );
          } else {
            // check if there is a next subject, else return nothing
            const subject = findNextSubject(action.props.subject);

            if (subject) {
              newSubject = subject;
              newLearningSet = generateLearningSet(subject, 1);
            } else {
              newLearningSet = [];
            }
          }
        }
      }
      return {
        ...action.props,
        right: [],
        wrong: [],
        testing: false,
        lesson: newLesson,
        subject: newSubject,
        currentSet: newLearningSet,
        learningSet: newLearningSet,
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
