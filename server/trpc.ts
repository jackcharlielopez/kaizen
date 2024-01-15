import { TRPCError, initTRPC } from "@trpc/server";
import { Context } from "@/server/context";
import { ZodError } from "zod";

const t = initTRPC.context<Context>().create({
  errorFormatter(opts) {
    const { shape, error } = opts;
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.code === "BAD_REQUEST" && error.cause instanceof ZodError
            ? {
                message: JSON.parse(error.message)[0].message,
                title: JSON.parse(error.message)[0].path,
              }
            : null,
      },
    };
  },
});

const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.session?.user?.email) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
  }
  return next({
    ctx: {
      session: ctx.session,
    },
  });
});

export const middleware = t.middleware;
export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
