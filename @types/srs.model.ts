export interface SRSModel {
  subject: subjectEnum;
  right: subjectValues[];
  wrong: subjectValues[];
  iterations: number;
  lesson: number;
  testing: boolean;
  learningSet: subjectValues[];
  currentSet: subjectValues[];
}

export const maxPerSet = 9;
export const maxPerLesson = 9;

export type subjectValues = { problem: string; solution: number };

export enum subjectEnum {
  addition = "+",
  subtraction = "-",
  multiplication = "×",
  division = "÷",
}

export const findNextSubject = (subject: subjectEnum) => {
  const subjects = Object.values(subjectEnum);
  const index = subjects.indexOf(subject);
  return index + 1 < subjects.length ? subjects[index + 1] : null;
};

export const set = (
  lesson: number,
  nextNum: number,
  operation: subjectEnum
) => {
  let nextSet: subjectValues | null = null;

  switch (operation) {
    case subjectEnum.addition:
      nextSet = {
        problem: lesson + " " + operation + " " + nextNum,
        solution: lesson + nextNum,
      };
      break;
    case subjectEnum.subtraction:
      if (lesson > nextNum) return;
      nextSet = {
        problem: nextNum + " " + operation + " " + lesson,
        solution: nextNum - lesson,
      };
      break;
    case subjectEnum.multiplication:
      nextSet = {
        problem: lesson + " " + operation + " " + nextNum,
        solution: lesson * nextNum,
      };
      break;
    case subjectEnum.division:
      nextSet = {
        problem: nextNum * lesson + " " + operation + " " + lesson,
        solution: nextNum,
      };
      break;
  }

  return nextSet;
};

export const generateLearningSet = (
  operation: subjectEnum,
  lesson: number
): { problem: string; solution: number }[] => {
  const learningSet = [];

  for (let x = 1; x <= maxPerSet; x++) {
    const nextSet: subjectValues | undefined = set(lesson, x, operation);
    nextSet && learningSet.push(nextSet);
  }

  return learningSet;
};

const subject = Object.values(subjectEnum)[0];
const lesson = 1;
const currentSet = generateLearningSet(subject, lesson);

export const defaultSRSObj: SRSModel = {
  subject,
  right: [],
  wrong: [],
  iterations: 0,
  lesson,
  testing: false,
  learningSet: currentSet,
  currentSet,
};

export const shuffleArr = (generatedLearningSet: subjectValues[]) => {
  for (let i = generatedLearningSet.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [generatedLearningSet[i], generatedLearningSet[j]] = [
      generatedLearningSet[j],
      generatedLearningSet[i],
    ];
  }
  return generatedLearningSet;
};
