import { Group, Paper, Stack, Text } from "@mantine/core";
import { useContext, useEffect, useMemo, useState } from "react";
import { AccountContext } from "../../accounts/layout";
import { Timer } from "./Timer";
import { StudentSessionStatusEnum } from "@/@types/user-status.model";
import React from "react";
import { StartPractice } from "./StartPractice";
import { EndPractice } from "./EndPractice";
import { IntroPractice } from "./IntroPractice";
import { StudentSessionContext } from "@/app/_store/StudentSession.store";
import { PracticeSessionProvider } from "@/app/_store/PracticeSession.store";
import { StudentReportProvider } from "@/app/_store/StudentReport.store";
import { trpc } from "@/app/_trpc/client";

const Student = () => {
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
        return StartPractice(id, initialState);
      case StudentSessionStatusEnum.finished:
        return EndPractice();
      case StudentSessionStatusEnum.default:
        return <IntroPractice name={name.split(" ")[0]} />;
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

export default Student;
