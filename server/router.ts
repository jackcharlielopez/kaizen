import { prisma } from "@/lib/prisma";
import { protectedProcedure, publicProcedure, router } from "./trpc";
import { z } from "zod";
import openai from "@/lib/openai";
import { ChatCompletionMessage } from "openai/resources/chat/index.mjs";

export const appRouter = router({
  getStudents: protectedProcedure
    .output(
      z.array(
        z.object({
          id: z.string(),
          name: z.string(),
          birthDate: z.date(),
          createdAt: z.date(),
          userId: z.string(),
        })
      )
    )
    .query(async ({ ctx }) => {
      return await prisma.student.findMany({
        where: {
          userId: ctx.session?.user.id,
        },
      });
    }),
  setOpenAiMessage: protectedProcedure
    .input(
      z.array(
        z.object({
          role: z.string(),
          content: z.string().nullable(),
        })
      )
    )
    .output(
      z.object({
        response: z.string().nullable(),
      })
    )
    .query(async ({ input }) => {
      const res = await openai.chat.completions.create({
        model: "gpt-4",
        messages: input as ChatCompletionMessage[],
      });

      return { response: res.choices[0].message.content };
    }),
});

export type AppRouter = typeof appRouter;
