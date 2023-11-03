export interface SRSModel {
  OOO: OOOEnum;
  right: OOOValues[];
  wrong: OOOValues[];
  iterations: number;
  currentSection: number;
  testing: boolean;
}

export type OOOValues = { problem: string; solution: number };

export enum OOOEnum {
  addition = "+",
  subtraction = "-",
  multiplication = "*",
  division = "/",
}

export const defaultSRSObj: SRSModel = {
  OOO: OOOEnum.addition,
  right: [],
  wrong: [],
  iterations: 0,
  currentSection: 1,
  testing: false,
};

export const solution = (mathProblem: number[], operation: OOOEnum) => {
  switch (operation) {
    case OOOEnum.addition:
      return mathProblem[0] + mathProblem[1];
    case OOOEnum.subtraction:
      return mathProblem[1] - mathProblem[0];
    case OOOEnum.multiplication:
      return mathProblem[0] * mathProblem[1];
    case OOOEnum.division:
      return mathProblem[1] / mathProblem[0];
  }
};

export const generateLearningSet = (
  operation: OOOEnum,
  currentSection: number
): { problem: string; solution: number }[] => {
  const learningSet = [];
  for (let x = 1; x <= 9; x++) {
    learningSet.push({
      problem: currentSection + " " + operation + " " + x,
      solution: solution([currentSection, x], operation),
    });
  }

  return learningSet;
};

export const shuffleArr = (generatedLearningSet: OOOValues[]) => {
  for (let i = generatedLearningSet.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [generatedLearningSet[i], generatedLearningSet[j]] = [
      generatedLearningSet[j],
      generatedLearningSet[i],
    ];
  }
  return generatedLearningSet;
};
