import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: { params: { examsId: string, quesId: string } }) {
    try {
      // Validate if examId and quesId are provided
      if (!params.examsId || !params.quesId) {
        return new NextResponse('ExamId and QuesId are required', { status: 400 });
      }
  
      // Check if the question exists in the exam
      const existingExamQuestion = await prisma.examQuestion.findFirst({
        where: {
          examId: params.examsId,
          quesId: params.quesId,
        },
      });
  
      if (!existingExamQuestion) {
        return new NextResponse('Exam question not found', { status: 404 });
      }
  
      // Proceed to delete the question
      const deletedExamQuestion = await prisma.examQuestion.delete({
        where: {
          id: existingExamQuestion.id,
        },
      });
  
      return NextResponse.json({
        message: 'Exam question removed successfully',
        deletedExamQuestion,
      });
  
    } catch (error) {
      console.error('Error at /api/examQuestion DELETE', error);
      return new NextResponse('Internal Server Error', { status: 500 });
    }
  }
  