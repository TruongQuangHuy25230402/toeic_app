"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
export type Part4Props = {
  id: string;
  questionText: string;
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
export async function getPart4(examId: string) {
  try {
    const part4ss = await prisma.questionPart4.findMany({
      where: {
        examId: examId, // Filter by examId
      },
    });
    return part4ss;
  } catch (error) {
    console.log(error);
  }
}
export async function createPart4(data: Part4Props) {
  try {
    const part4 = await prisma.questionPart4.create({
      data: {
        questionText: data.questionText,
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
    return part4;
  } catch (error) {
    console.log(error);
  }
}
export async function createBulkPart4s(part4ss: Part4Props[]) {
  try {
    for (const part4 of part4ss) {
      // Thiết lập imageFile mặc định là chuỗi rỗng nếu không có giá trị
      const part4Data: Part4Props = {
        ...part4,
        imageFile: part4.imageFile || '', // Nếu imageFile không có, đặt thành chuỗi rỗng
      };
      await createPart4(part4Data);
    }
  } catch (error) {
    console.log(error);
  }
}

export async function deletePart4s(examId: string) {
  try {
    // Use the examId to filter the records to be deleted
    await prisma.questionPart4.deleteMany({
      where: {
        examId: examId, // Filter by examId
      },
    });
    revalidatePath("/"); // Optionally revalidate the path after deletion
  } catch (error) {
    console.log(error);
  }
}
