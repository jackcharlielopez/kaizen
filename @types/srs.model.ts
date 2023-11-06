export interface SRSModel {
  subject: subjectEnum;
  right: subjectValues[];
  wrong: subjectValues[];
  iterations: number;
  lesson: number;
  testing: boolean;
}

export type subjectValues = { problem: string; solution: number };

export enum subjectEnum {
  addition = "+",
  subtraction = "-",
  multiplication = "*",
  division = "/",
}

export const defaultSRSObj: SRSModel = {
  subject: subjectEnum.addition,
  right: [],
  wrong: [],
  iterations: 0,
  lesson: 1,
  testing: false,
};

export const solution = (mathProblem: number[], operation: subjectEnum) => {
  switch (operation) {
    case subjectEnum.addition:
      return mathProblem[0] + mathProblem[1];
    case subjectEnum.subtraction:
      return mathProblem[1] - mathProblem[0];
    case subjectEnum.multiplication:
      return mathProblem[0] * mathProblem[1];
    case subjectEnum.division:
      return mathProblem[1] / mathProblem[0];
  }
};

export const generateLearningSet = (
  operation: subjectEnum,
  lesson: number
): { problem: string; solution: number }[] => {
  const learningSet = [];
  for (let x = 1; x <= 9; x++) {
    learningSet.push({
      problem: lesson + " " + operation + " " + x,
      solution: solution([lesson, x], operation),
    });
  }

  return learningSet;
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
