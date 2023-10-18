"use client";

import { Box } from "@mantine/core";
import { trpc } from "../_trpc/client";

// this will be netflix style profile creation and choosing
// this should skip if only profile that exists is parents
// this should fetch children on the server

const SelectProfile = () => {
  const { data } = trpc.getStudents.useQuery();

  return <Box>Profile choose page</Box>;
};

export default SelectProfile;
