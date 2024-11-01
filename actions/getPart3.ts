"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
export type Part3Props = {
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
export async function getPart3(examId: string) {
  try {
    const part3ss = await prisma.questionPart3.findMany({
      where: {
        examId: examId, // Filter by examId
      },
    });
    return part3ss;
  } catch (error) {
    console.log(error);
  }
}
export async function createPart3(data: Part3Props) {
  try {
    const part3 = await prisma.questionPart3.create({
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
    return part3;
  } catch (error) {
    console.log(error);
  }
}
export async function createBulkPart3s(part3ss: Part3Props[]) {
  try {
    for (const part3 of part3ss) {
      // Thiết lập imageFile mặc định là chuỗi rỗng nếu không có giá trị
      const part3Data: Part3Props = {
        ...part3,
        imageFile: part3.imageFile || '', // Nếu imageFile không có, đặt thành chuỗi rỗng
      };
      await createPart3(part3Data);
    }
  } catch (error) {
    console.log(error);
  }
}

export async function deletePart3s(examId: string) {
  try {
    // Use the examId to filter the records to be deleted
    await prisma.questionPart3.deleteMany({
      where: {
        examId: examId, // Filter by examId
      },
    });
    revalidatePath("/"); // Optionally revalidate the path after deletion
  } catch (error) {
    console.log(error);
  }
}
