import { prisma } from "@/lib/prisma";
import { protectedProcedure, router } from "./trpc";
import { z } from "zod";
import openai from "@/lib/openai";
import { GetHelpPrompt } from "@/lib/prompts";
import fs from "fs";
import path from "path";
import { SRSModel, defaultSRSObj } from "@/@types/srs.model";

const toTitleCase = (text: string) => {
  return text.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

export const appRouter = router({
  addStudent: protectedProcedure
    .input(
      z.object({
        "Full Name": z
          .string()
          .refine(
            (value) => /^[a-zA-Z]+[-'s]?[a-zA-Z ]+$/.test(value),
            "Name should contain only alphabets"
          )
          .refine(
            (value) => /^[a-zA-Z]+\s+[a-zA-Z]+$/.test(value),
            "Please enter both firstname and lastname"
          ),
        "Birth Date": z.string(),
        userId: z.string(),
      })
    )
    .output(
      z.object({
        id: z.string(),
        name: z.string(),
        birthDate: z.date(),
        createdAt: z.date(),
        userId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return await prisma.student.create({
        data: {
          name: toTitleCase(input["Full Name"]),
          birthDate: new Date(input["Birth Date"]),
          userId: input.userId,
        },
      });
    }),
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
        elapsedTime: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await prisma.report.create({
          data: {
            studentId: input.studentId,
            content: input.report,
            elapsedTime: input.elapsedTime || 0,
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
    .mutation(async ({ input }) => {
      const data = await prisma.report.findMany({
        where: {
          studentId: input.studentId,
        },
      });

      const calculateValue = (obj: SRSModel, time: number, date: Date) => {
        const { right, wrong } = obj;
        const total = right.length + wrong.length;
        const correct = right.length;
        const incorrect = wrong.length;
        return { total, correct, incorrect, time, date };
      };

      const groupReportsBySubject = data.reduce((acc, obj) => {
        const parsedContent = JSON.parse(obj.content);
        const { subject, lesson } = parsedContent;
        const value = calculateValue(
          parsedContent,
          obj.elapsedTime,
          obj.createdAt
        );

        if (!acc[subject]) {
          acc[subject] = {};
        }

        if (!acc[subject][lesson]) {
          acc[subject][lesson] = [];
        }

        acc[subject][lesson].push(value);

        return acc;
      }, {});
      return groupReportsBySubject;
    }),
  getLatestStudentReport: protectedProcedure
    .input(
      z.object({
        studentId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const res = await prisma.report.findFirst({
        where: {
          studentId: input.studentId,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      });

      return res ? JSON.parse(res.content) : defaultSRSObj;
    }),
});

export type AppRouter = typeof appRouter;
