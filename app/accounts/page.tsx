"use client";

import { useContext } from "react";
import { AccountContext } from "./layout";
import Parent from "../_components/parent/Parent";
import Student from "../_components/student/Student";
import { StudentSessionProvider } from "../_store/StudentSession.store";

const UserAccount = () => {
  const { role } = useContext(AccountContext);

  if (role === "parent") return <Parent />;

  return (
    <StudentSessionProvider>
      <Student />
    </StudentSessionProvider>
  );
};

export default UserAccount;
