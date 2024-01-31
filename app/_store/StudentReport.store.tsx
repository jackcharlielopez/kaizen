import {
  subjectValues,
  SRSModel,
  defaultSRSObj,
  findNextSubject,
  shuffleArr,
  generateLearningSet,
  maxPerLesson,
  midLesson,
} from "@/@types/srs.model";
import { UserActionsEnum } from "@/@types/user-status.model";
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
        userActionsState: UserActionsEnum.practice,
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
        userActionsState: UserActionsEnum.practice,
        learningSet,
        currentSet: learningSet,
      };
    case "quiz":
      return {
        ...state,
        right: [],
        wrong: [],
        iterations: 0,
        userActionsState: UserActionsEnum.quiz,
        currentSet: shuffleArr(state.learningSet),
      };
    case "midExam":
      const generatedMidSet = [];

      for (let x = 1; x <= midLesson; x++) {
        generatedMidSet.push(...generateLearningSet(state.subject, x));
      }

      return {
        ...state,
        right: [],
        wrong: [],
        iterations: 0,
        lesson: midLesson + 0.5,
        userActionsState: UserActionsEnum.practice,
        learningSet: generatedMidSet,
        currentSet: shuffleArr(generatedMidSet),
      };
    case "finalExam":
      const generatedFinalSet = [];

      for (let x = 1; x <= maxPerLesson; x++) {
        generatedFinalSet.push(...generateLearningSet(state.subject, x));
      }

      return {
        ...state,
        right: [],
        wrong: [],
        iterations: 0,
        lesson: maxPerLesson + 0.5,
        userActionsState: UserActionsEnum.practice,
        learningSet: generatedFinalSet,
        currentSet: shuffleArr(generatedFinalSet),
      };
    case "practice":
      return {
        ...state,
        right: [],
        wrong: [],
        iterations: 0,
        userActionsState: UserActionsEnum.practice,
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
      if (action.props.userActionsState !== UserActionsEnum.quiz) {
        return action.props;
      } else {
        // if user has gotten wrong answers repeat session
        if (action.props.wrong.length) {
          newLearningSet = action.props.learningSet;
        } else {
          // if no wrong answer get next lesson, ensure next lesson exists or move to next subject
          if (action.props.lesson < maxPerLesson) {
            // check if mid exam is next
            if (action.props.lesson === midLesson) {
              const generatedMidSet = [];

              for (let x = 1; x <= midLesson; x++) {
                generatedMidSet.push(...generateLearningSet(state.subject, x));
              }

              newLearningSet = generatedMidSet;
            }
            // return next lesson
            else {
              newLesson = action.props.lesson + 1;
              newLearningSet = generateLearningSet(
                action.props.subject,
                newLesson
              );
            }
          } // check if final exam is next
          else if (action.props.lesson === maxPerLesson) {
            const generatedFinalSet = [];

            for (let x = 1; x <= maxPerLesson; x++) {
              generatedFinalSet.push(...generateLearningSet(state.subject, x));
            }

            newLearningSet = generatedFinalSet;
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
        userActionsState: UserActionsEnum.practice,
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
