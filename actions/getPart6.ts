"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
export type Part6Props = {
  id: string;
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
export async function getPart6(examId: string) {
  try {
    const part6ss = await prisma.questionPart6.findMany({
      where: {
        examId: examId, // Filter by examId
      },
    });
    return part6ss;
  } catch (error) {
    console.log(error);
  }
}
export async function createPart6(data: Part6Props) {
  try {
    const part6 = await prisma.questionPart6.create({
      data: {
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
    return part6;
  } catch (error) {
    console.log(error);
  }
}
export async function createBulkPart6s(part6ss: Part6Props[]) {
  try {
    for (const part6 of part6ss) {
      // Thiết lập imageFile mặc định là chuỗi rỗng nếu không có giá trị
      const part6Data: Part6Props = {
        ...part6,
        imageFile: part6.imageFile || '', // Nếu imageFile không có, đặt thành chuỗi rỗng
      };
      await createPart6(part6Data);
    }
  } catch (error) {
    console.log(error);
  }
}

export async function deletePart6s(examId: string) {
  try {
    // Use the examId to filter the records to be deleted
    await prisma.questionPart6.deleteMany({
      where: {
        examId: examId, // Filter by examId
      },
    });
    revalidatePath("/"); // Optionally revalidate the path after deletion
  } catch (error) {
    console.log(error);
  }
}
