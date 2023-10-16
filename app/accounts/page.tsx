import { Box } from "@mantine/core";
import { useSession } from "next-auth/react";

// this will be netflix style profile creation and choosing
// this should skip if only profile that exists is parents
// this should fetch children on the server

const SelectProfile = async () => {
  // const res = await fetch("/api/trpc/getStudents");
  // const students = await res.json();

  // console.log(students);

  return <Box>Profile choose page</Box>;
};

export default SelectProfile;
