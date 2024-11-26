"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import * as levenshtein from 'fast-levenshtein'; // Correct way to import


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
    // Mảng lưu các câu hỏi đã tồn tại trong hệ thống
    const existingQuestions = await prisma.questionsT.findMany({
      where: {
        // Không cần kiểm tra theo examsId vì bạn muốn kiểm tra tất cả các bài thi cũ
      },
    });

    let duplicateCount = 0; // Biến đếm số lượng câu hỏi trùng
    const maxDuplicates = 100; // Giới hạn số lượng trùng

    // Kiểm tra từng câu hỏi xem có trùng với câu hỏi đã có trong cơ sở dữ liệu không
    for (const question of questionss) {
      const existingQuestion = existingQuestions.find(
        (existing) =>
          existing.questionText === question.questionText &&
          existing.explainAnswer === question.explainAnswer
      );

      // Nếu câu hỏi đã tồn tại, tăng số lượng trùng
      if (existingQuestion) {
        duplicateCount++;
      }

      // Nếu có hơn 100 câu trùng, dừng lại và thông báo lỗi
      if (duplicateCount >= maxDuplicates) {
        throw new Error("Đề thi đã được upload. Đã có hơn 50% câu hỏi trùng lặp!");
      }
    }

    // Nếu số lượng trùng ít hơn 100, tiếp tục thêm câu hỏi mới vào cơ sở dữ liệu
    if (duplicateCount < maxDuplicates) {
      for (const question of questionss) {
        await createQuestions(question); // Thêm câu hỏi mới vào database
      }
      console.log(`Đã thêm ${questionss.length} câu hỏi mới.`);
    }

  } catch (error) {
    console.log("Lỗi trong quá trình thêm dữ liệu:");
    throw error;  // Ném lại lỗi nếu cần xử lý tiếp
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
