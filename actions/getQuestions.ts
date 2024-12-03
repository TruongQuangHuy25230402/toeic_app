"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";


export type QuestionsProps = {
  id?: string;
  questionText?: string;
  audioFile?: string;
  imageFile?: string;
  answer1?: string;
  answer2?: string;
  answer3?: string;
  answer4?: string;
  correctAnswer?: string; // Đáp án đúng
  explainAnswer?: string;
  examsId?: string;
  userId:  string;
  groupId: string | null;
};
export async function getQuestions(examsId: string) {
  try {
    const questionss = await prisma.questionsT.findMany({
      where: {
        examsId: examsId, // Filter by examId
      },
    });
    return questionss;
  } catch (error) {
    console.log(error);
  }
}
export async function createQuestions(data: QuestionsProps) {
  try {
    const questions = await prisma.questionsT.create({
      data: {
        audioFile: data.audioFile ?? "",
        imageFile: data.imageFile ?? "",
        questionText: data.questionText ?? "",
        answer1: data.answer1 ?? "",
        answer2: data.answer2 ?? "",
        answer3: data.answer3 ?? "",
        answer4: data.answer4 ?? "",
        correctAnswer: data.correctAnswer ?? "", // Đáp án đúng
        explainAnswer: data.explainAnswer ?? "",
        examsId: data.examsId,
        userId: data.userId,
        groupId: data.groupId ?? "",
      },
    });
    revalidatePath("/");
    return questions;
  } catch (error) {
    console.log(error);
  }
}

export async function createBulkQuestionss(questionss: QuestionsProps[]) {
  try {
    const existingQuestions = await prisma.questionsT.findMany();

    if (!Array.isArray(existingQuestions)) {
      throw new Error("Failed to fetch existing questions.");
    }

    let duplicateCount = 0;
    const maxDuplicates = 100;

    for (const question of questionss) {
      const isDuplicate = existingQuestions.some(
        (existing) =>
          existing.questionText === question.questionText &&
          existing.explainAnswer === question.explainAnswer
      );

      if (isDuplicate) duplicateCount++;
      if (duplicateCount >= maxDuplicates) {
        throw new Error("Over 50% of the questions are duplicates. Upload stopped.");
      }
    }

    // Synchronously insert questions to ensure order
    for (const question of questionss) {
      await createQuestions(question);
    }

    console.log(`Successfully added ${questionss.length - duplicateCount} new questions.`);
  } catch (error) {
    console.error("Error adding bulk questions:", error);
    throw new Error("Over 50% of the questions are duplicates. Upload stopped.");
  }
}




export async function deleteQuestionss(examsId: string) {
  try {
    // Use the examId to filter the records to be deleted
    await prisma.questionsT.deleteMany({
      where: {
        examsId: examsId, // Filter by examId
      },
    });
    revalidatePath("/"); // Optionally revalidate the path after deletion
  } catch (error) {
    console.log(error);
  }
}
