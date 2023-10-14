"use client";

import { Box } from "@mantine/core";
import { useSession } from "next-auth/react";

// this will be netflix style profile creation and choosing
const SelectProfile = () => {
  const session = useSession();

  console.log(session);

  return <Box>Profile choose page</Box>;
};

export default SelectProfile;
