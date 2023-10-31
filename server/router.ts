import { prisma } from "@/lib/prisma";
import { protectedProcedure, router } from "./trpc";
import { z } from "zod";
import openai from "@/lib/openai";
import { ChatCompletionMessage } from "openai/resources/chat/index.mjs";
import { LearningPrompt } from "@/lib/Prompts";

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
        role: z.string(),
        content: z.string().nullable(),
      })
    )
    .mutation(async ({ input: message }) => {
      const res = await openai.chat.completions.create({
        model: "gpt-4",
        max_tokens: 15,
        temperature: 0.7,
        messages: [LearningPrompt, ...message] as any,
      });

      return { response: res.choices[0].message };
    }),
});

export type AppRouter = typeof appRouter;
