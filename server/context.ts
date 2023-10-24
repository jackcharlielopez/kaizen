import { type inferAsyncReturnType } from "@trpc/server";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { getServerSession } from "next-auth";

export async function createContext({
  req,
  resHeaders,
}: FetchCreateContextFnOptions) {
  const user = { name: req.headers.get("username") ?? "anonymous" };
  const session = await getServerSession();
  return { req, resHeaders, user, session };
}

export type Context = inferAsyncReturnType<typeof createContext>;
