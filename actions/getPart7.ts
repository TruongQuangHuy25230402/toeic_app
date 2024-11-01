"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
export type Part7Props = {
    id:             string;
    questionText:   string;  
    imageFile:      string;
    answer1:        string;
    answer2:        string;
    answer3:        string;
    answer4:        string;
    correctAnswer:  string;      // Đáp án đúng
    explainAnswer:  string;
    examId:         string;
    topicId:        string;
};
export async function getPart7(examId: string) {
  try {
    const part7ss = await prisma.questionPart7.findMany({
      where: {
        examId: examId, // Filter by examId
      },
    });
    return part7ss;
  } catch (error) {
    console.log(error);
  }
}
export async function createPart7(data: Part7Props) {
  try {
    const part7 = await prisma.questionPart7.create({
      data: {
    questionText:   data.questionText,
    imageFile:         data.imageFile,  
    answer1:        data.answer1,
    answer2:        data.answer2,
    answer3:        data.answer3,
    answer4:        data.answer4,
    correctAnswer:  data.correctAnswer,      // Đáp án đúng
    explainAnswer:  data.explainAnswer,
    examId:         data.examId,
    topicId:        data.topicId,
      },
    });
    revalidatePath("/");
    return part7;
  } catch (error) {
    console.log(error);
  }
}
export async function createBulkPart7s(part7ss: Part7Props[]) {
  try {
    for (const part7 of part7ss) {
      // Thiết lập imageFile mặc định là chuỗi rỗng nếu không có giá trị
      const part7Data: Part7Props = {
        ...part7,
        imageFile: part7.imageFile || '', // Nếu imageFile không có, đặt thành chuỗi rỗng
      };
      await createPart7(part7Data);
    }
  } catch (error) {
    console.log(error);
  }
}


export async function deletePart7s(examId: string) {
  try {
    // Use the examId to filter the records to be deleted
    await prisma.questionPart7.deleteMany({
      where: {
        examId: examId, // Filter by examId
      },
    });
    revalidatePath("/"); // Optionally revalidate the path after deletion
  } catch (error) {
    console.log(error);
  }
}
