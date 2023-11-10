import { prisma } from "@/lib/prisma";
import { protectedProcedure, router } from "./trpc";
import { z } from "zod";
import openai from "@/lib/openai";
import { GetHelpPrompt } from "@/lib/prompts";

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
  getHelpAI: protectedProcedure
    .input(z.string())
    .output(z.string().nullable())
    .mutation(async ({ input: content }) => {
      try {
        const res = await openai.chat.completions.create({
          model: "gpt-4",
          max_tokens: 150,
          temperature: 0.7,
          messages: [GetHelpPrompt, { role: "user", content }] as any,
        });

        return res.choices[0].message.content;
      } catch {
        throw new Error("Failed to connect to tutor");
      }
    }),
});

export type AppRouter = typeof appRouter;
