import { Dispatch, SetStateAction } from "react";
import { SRSModel } from "./srs.model";

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

export type StudentPreviousReportContext = {
  studentPreviousReport: SRSModel;
  setStudentPreviousReport: Dispatch<SetStateAction<SRSModel>>;
};
