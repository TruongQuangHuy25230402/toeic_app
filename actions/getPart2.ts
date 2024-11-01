"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
export type Part2Props = {
    id:             string;
    audioFile:   string;  
    answer1:        string;
    answer2:        string;
    answer3:        string;
    correctAnswer:  string;      // Đáp án đúng
    explainAnswer:  string;
    examId:         string;
    topicId:        string;
};
export async function getPart2(examId: string) {
  try {
    const part2ss = await prisma.questionPart2.findMany({
      where: {
        examId: examId, // Filter by examId
      },
    });
    return part2ss;
  } catch (error) {
    console.log(error);
  }
}
export async function createPart2(data: Part2Props) {
  try {
    const part2 = await prisma.questionPart2.create({
      data: {
    audioFile:      data.audioFile,  
    answer1:        data.answer1,
    answer2:        data.answer2,
    answer3:        data.answer3,
    correctAnswer:  data.correctAnswer,      // Đáp án đúng
    explainAnswer:  data.explainAnswer,
    examId:         data.examId,
    topicId:        data.topicId,
      },
    });
    revalidatePath("/");
    return part2;
  } catch (error) {
    console.log(error);
  }
}
export async function createBulkPart2s(part2ss: Part2Props[]) {
  try {
    for (const part2 of part2ss) {
      await createPart2(part2);
    }
  } catch (error) {
    console.log(error);
  }
}


export async function deletePart2s(examId: string) {
  try {
    // Use the examId to filter the records to be deleted
    await prisma.questionPart2.deleteMany({
      where: {
        examId: examId, // Filter by examId
      },
    });
    revalidatePath("/"); // Optionally revalidate the path after deletion
  } catch (error) {
    console.log(error);
  }
}
