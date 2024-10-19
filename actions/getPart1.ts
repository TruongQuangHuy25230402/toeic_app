"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
export type Part1Props = {
  id: string;
  audioFile: string;
  imageFile: string;
  answer1: string;
  answer2: string;
  answer3: string;
  answer4: string;
  correctAnswer: string; // Đáp án đúng
  explainAnswer: string;
  examId: string;
  topicId: string;
};
export async function getPart1(examId: string) {
  try {
    const part1ss = await prisma.questionPart1.findMany({
      where: {
        examId: examId, // Filter by examId
      },
    });
    return part1ss;
  } catch (error) {
    console.log(error);
  }
}
export async function createPart1(data: Part1Props) {
  try {
    const part1 = await prisma.questionPart1.create({
      data: {
        audioFile: data.audioFile,
        imageFile: data.imageFile,
        answer1: data.answer1,
        answer2: data.answer2,
        answer3: data.answer3,
        answer4: data.answer4,
        correctAnswer: data.correctAnswer, // Đáp án đúng
        explainAnswer: data.explainAnswer,
        examId: data.examId,
        topicId: data.topicId,
      },
    });
    revalidatePath("/");
    return part1;
  } catch (error) {
    console.log(error);
  }
}
export async function createBulkPart1s(part1ss: Part1Props[]) {
  try {
    for (const part1 of part1ss) {
      await createPart1(part1);
    }
  } catch (error) {
    console.log(error);
  }
}

export async function deletePart1s(examId: string) {
  try {
    // Use the examId to filter the records to be deleted
    await prisma.questionPart1.deleteMany({
      where: {
        examId: examId, // Filter by examId
      },
    });
    revalidatePath("/"); // Optionally revalidate the path after deletion
  } catch (error) {
    console.log(error);
  }
}
