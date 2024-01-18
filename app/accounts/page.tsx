"use client";

import { useContext } from "react";
import { AccountContext } from "./layout";
import Parent from "../_components/parent/Parent";
import { StudentSessionProvider } from "../_store/StudentSession.store";
import { StudentLayout } from "../_components/student/StudentLayout";

export const UserAccount = () => {
  const { role } = useContext<any>(AccountContext);

  if (role === "parent") return <Parent />;

  return (
    <StudentSessionProvider>
      <StudentLayout />
    </StudentSessionProvider>
  );
};

export default UserAccount;
