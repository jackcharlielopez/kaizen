import { Dispatch, SetStateAction } from "react";

export enum StudentSessionStatusEnum {
  start,
  stop,
  finished,
  default,
}

export type StudentSessionStatusContext = {
  studentSessionStatus: StudentSessionStatusEnum;
  setStudentSessionStatus: Dispatch<SetStateAction<StudentSessionStatusEnum>>;
};
