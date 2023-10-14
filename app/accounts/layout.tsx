"use client";

import { SessionProvider } from "next-auth/react";

const AccountsLayout = ({ children }: { children: React.ReactNode }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default AccountsLayout;
