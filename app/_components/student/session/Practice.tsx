import { StudentReportContext } from "@/app/_store/StudentReport.store";
import { useContext, useState } from "react";
import { Question } from "./Question";

export const Practice = () => {
  const { state: report, dispatch: reportDispatch } =
    useContext<any>(StudentReportContext);

  const [counter, setCounter] = useState(
    report.wrong.length + report.right.length
  );

  return (
    <Question
      qandA={report.currentSet[counter]}
      counter={counter}
      setCounter={setCounter}
    />
  );
};
