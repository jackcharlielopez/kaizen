import { useContext, useMemo } from "react";
import { StudentSessionStatusEnum } from "@/@types/user-status.model";
import { StudentSessionContext } from "@/app/_store/StudentSession.store";
import { StartSession } from "./StartSession";
import { FinishedSession } from "./FinishedSession";
import { StudentHome } from "./StudentHome";
import { StudentReportContext } from "@/app/_store/StudentReport.store";
import { trpc } from "@/app/_trpc/client";
import { AccountContext } from "@/app/accounts/layout";
import { SRSModel } from "@/@types/srs.model";
export const StudentLayout = () => {
  const { id } = useContext<any>(AccountContext);
  const { dispatch: reportDispatch } = useContext<any>(StudentReportContext);
  const {
    state: { status },
  } = useContext<any>(StudentSessionContext);

  trpc.getLatestStudentReport.useQuery(
    {
      studentId: id,
    },
    {
      onSuccess(data: SRSModel) {
        reportDispatch({ type: "initialState", props: data });
      },
    }
  );

  const GetContent = () => {
    switch (status) {
      case StudentSessionStatusEnum.start:
        return StartSession();
      case StudentSessionStatusEnum.finished:
        return FinishedSession();
      case StudentSessionStatusEnum.default:
        return StudentHome();
    }
  };

  return (
    <>
      {useMemo(
        () => (
          <GetContent />
        ),
        [status]
      )}
    </>
  );
};
