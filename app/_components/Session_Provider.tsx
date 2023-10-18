"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const Session_Provider = ({ children }: Props) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default Session_Provider;
