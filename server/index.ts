import { prisma } from "@/lib/prisma";
import { protectedProcedure, router } from "./trpc";
import { z } from "zod";

export const appRouter = router({
  getStudents: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.id;

    return await prisma.student.findMany({
      where: {
        userId,
      },
    });
  }),
  getUserId: protectedProcedure.query(async ({ ctx }) => {
    const email = ctx.session.user?.email;

    if (!email) return;

    return await prisma.user.findUnique({
      where: {
        email,
      },
    });
  }),
});

export type AppRouter = typeof appRouter;
