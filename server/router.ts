import { prisma } from "@/lib/prisma";
import { publicProcedure, router } from "./trpc";

export const appRouter = router({
  getStudents: publicProcedure.query(async ({ ctx }) => {
    return await prisma.student.findMany({
      where: {
        userId: ctx.session?.user.id,
      },
    });
  }),
});

export type AppRouter = typeof appRouter;
