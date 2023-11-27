import { prisma } from "@/lib/prisma";
import { protectedProcedure, router } from "./trpc";
import { z } from "zod";
import openai from "@/lib/openai";
import { GetHelpPrompt } from "@/lib/prompts";
import fs from "fs";
import path from "path";

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
          model: "gpt-3.5-turbo",
          max_tokens: 150,
          temperature: 0.7,
          messages: [GetHelpPrompt, { role: "user", content }] as any,
        });

        return res.choices[0].message.content;
      } catch {
        throw new Error("Failed to connect to tutor");
      }
    }),
  converTextToSpeech: protectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      try {
        const res: any = await openai.audio.speech.create({
          model: "tts-1",
          voice: "alloy",
          input,
        });

        const file = `/${Date.now()}.mp3`;
        const filePath = path.join(process.cwd(), `./public${file}`);

        const buffer = Buffer.from(await res.arrayBuffer());

        await fs.promises.writeFile(filePath, buffer);

        return file;
      } catch (error) {
        throw new Error("Failed to convert text to speech");
      }
    }),
  saveStudentReport: protectedProcedure
    .input(
      z.object({
        studentId: z.string(),
        report: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await prisma.report.create({
          data: {
            studentId: input.studentId,
            content: input.report,
          },
        });
        return true;
      } catch (err) {
        throw new Error("Failed to save report");
      }
    }),
  getStudentReports: protectedProcedure
    .input(
      z.object({
        studentId: z.string(),
      })
    )
    .query(async ({ input }) => {
      return await prisma.report.findMany({
        where: {
          studentId: input.studentId,
        },
      });
    }),
  getLatestStudentReport: protectedProcedure
    .input(
      z.object({
        studentId: z.string(),
      })
    )
    .query(async ({ input }) => {
      return await prisma.report.findMany({
        where: {
          studentId: input.studentId,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      });
    }),
});

export type AppRouter = typeof appRouter;
