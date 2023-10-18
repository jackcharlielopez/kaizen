import { type inferAsyncReturnType } from "@trpc/server";
import { getSession } from "next-auth/react";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

export async function createContext({
  req,
  resHeaders,
}: FetchCreateContextFnOptions) {
  const user = { name: req.headers.get("username") ?? "anonymous" };
  const session = await getSession();
  return { req, resHeaders, user, session };
}

export type Context = inferAsyncReturnType<typeof createContext>;
