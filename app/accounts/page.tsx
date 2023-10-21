"use client";

import { useContext } from "react";
import { AccountContext } from "./layout";
import Parent from "../_components/Parent";
import Student from "../_components/Student";

const UserAccount = () => {
  let { role } = useContext(AccountContext);

  if (role === "parent") return <Parent></Parent>;

  return <Student></Student>;
};

export default UserAccount;
