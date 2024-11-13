"use server";
import prisma from "@/lib/prisma";
import { QuestionPart } from "@prisma/client";
import { revalidatePath } from "next/cache";
export type QuesProps = {
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
  userId:  string;
  groupId?: string;
  part?: QuestionPart; // Change from `string` to `QuestionPart`
};

export async function getQuestions() {
  try {
    const questionss = await prisma.ques.findMany({
    });
    return questionss;
  } catch (error) {
    console.log(error);
  }
}

export async function createQuestions(data: QuesProps) {
  try {
    const questions = await prisma.ques.create({
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
        part: data.part ?? QuestionPart.questionPart1,
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
export async function createBulkQuestionss(questionss: QuesProps[]) {
  try {
    for (const questions of questionss) {
      await createQuestions(questions);
    }
  } catch (error) {
    console.log(error);
  }
}

export async function deleteQuestionss() {
  try {
    // Use the examId to filter the records to be deleted
    await prisma.ques.deleteMany({
      
    });
    revalidatePath("/"); // Optionally revalidate the path after deletion
  } catch (error) {
    console.log(error);
  }
}
