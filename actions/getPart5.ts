"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
export type Part5Props = {
    id:             string;
    questionText:   string;  
    answer1:        string;
    answer2:        string;
    answer3:        string;
    answer4:        string;
    correctAnswer:  string;      // Đáp án đúng
    explainAnswer:  string;
    examId:         string;
    topicId:        string;
};
export async function getPart5(examId: string) {
  try {
    const part5ss = await prisma.questionPart5.findMany({
      where: {
        examId: examId, // Filter by examId
      },
    });
    return part5ss;
  } catch (error) {
    console.log(error);
  }
}
export async function createPart5(data: Part5Props) {
  try {
    const part5 = await prisma.questionPart5.create({
      data: {
    questionText:   data.questionText,  
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
    return part5;
  } catch (error) {
    console.log(error);
  }
}
export async function createBulkPart5s(part5ss: Part5Props[]) {
  try {
    for (const part5 of part5ss) {
      await createPart5(part5);
    }
  } catch (error) {
    console.log(error);
  }
}


export async function deletePart5s(examId: string) {
  try {
    // Use the examId to filter the records to be deleted
    await prisma.questionPart5.deleteMany({
      where: {
        examId: examId, // Filter by examId
      },
    });
    revalidatePath("/"); // Optionally revalidate the path after deletion
  } catch (error) {
    console.log(error);
  }
}
