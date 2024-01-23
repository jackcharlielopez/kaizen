import { Group, Paper, Stack, Text } from "@mantine/core";
import { useContext, useEffect, useMemo, useState } from "react";
import { AccountContext } from "../../accounts/layout";
import { Timer } from "./Timer";
import { StudentSessionStatusEnum } from "@/@types/user-status.model";
import React from "react";
import { StudentSessionContext } from "@/app/_store/StudentSession.store";
import { PracticeSessionProvider } from "@/app/_store/PracticeSession.store";
import { StudentReportProvider } from "@/app/_store/StudentReport.store";
import { trpc } from "@/app/_trpc/client";
import { StartSession } from "./StartSession";
import { FinishedSession } from "./FinishedSession";
import { StudentHome } from "./StudentHome";

export const StudentLayout = () => {
  const { name, id } = useContext<any>(AccountContext);
  const {
    state: { status },
  } = useContext<any>(StudentSessionContext);
  const { data: initialState } = trpc.getLatestStudentReport.useQuery({
    studentId: id,
  });

  const GetContent = () => {
    switch (status) {
      case StudentSessionStatusEnum.start:
        return StartSession(id, initialState);
      case StudentSessionStatusEnum.finished:
        return FinishedSession();
      case StudentSessionStatusEnum.default:
        return (
          <StudentHome
            name={name.split(" ")[0]}
            id={id}
            initialState={initialState}
          />
        );
    }
  };

  return (
    <StudentReportProvider>
      <PracticeSessionProvider>
        {useMemo(
          () => (
            <GetContent />
          ),
          [status, initialState]
        )}
      </PracticeSessionProvider>
    </StudentReportProvider>
  );
};
