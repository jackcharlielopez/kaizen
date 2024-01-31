"use client";

import React from "react";
import { PracticeSessionProvider } from "@/app/_store/PracticeSession.store";
import { StudentReportProvider } from "@/app/_store/StudentReport.store";
import { StudentSessionProvider } from "@/app/_store/StudentSession.store";

export const StudentLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <StudentSessionProvider>
      <StudentReportProvider>
        <PracticeSessionProvider>{children}</PracticeSessionProvider>
      </StudentReportProvider>
    </StudentSessionProvider>
  );
};
