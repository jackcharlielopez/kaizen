"use client";

import { useContext } from "react";
import { AccountContext } from "./layout";
import Parent from "../_components/parent/Parent";
import { StudentSessionProvider } from "../_store/StudentSession.store";
import { StudentLayout } from "../_components/student/StudentLayout";
import { PracticeSessionProvider } from "../_store/PracticeSession.store";
import { StudentReportProvider } from "../_store/StudentReport.store";

export const UserAccount = () => {
  const { role } = useContext<any>(AccountContext);

  if (role === "parent") {
    return <Parent />;
  } else {
    return (
      <StudentSessionProvider>
        <StudentReportProvider>
          <PracticeSessionProvider>
            <StudentLayout />
          </PracticeSessionProvider>
        </StudentReportProvider>
      </StudentSessionProvider>
    );
  }
};

export default UserAccount;
