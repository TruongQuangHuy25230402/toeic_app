import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id: questionId } = params; // Extract the questionId from URL params

  try {
    const count = await prisma.examQuestion.count({
      where: { quesId: questionId }, // Count the number of exams related to this question
    });
    return new Response(JSON.stringify({ count }), { status: 200 }); // Return the count
  } catch (error) {
    console.error("Failed to fetch exams count:", error);
    return new Response(JSON.stringify({ error: 'Failed to fetch exams count' }), { status: 500 });
  }
}

// API route for deleting ExamQuestion based on both examId and quesId
export async function DELETE(req: Request, { params }: { params: { quesId: string } }) {
  try {
    // Get the examId from the body (not the URL)
    const { examId } = await req.json();

    console.log('Received params:', params);
    console.log('Received examId:', examId);

    if (!examId || !params.quesId) {
      return new NextResponse('ExamId and QuesId are required', { status: 400 });
    }

    // Check if the exam question exists based on both examId and quesId
    const existingExamQuestion = await prisma.examQuestion.findFirst({
      where: {
        examId: examId,
        quesId: params.quesId,
      }
    });

    if (!existingExamQuestion) {
      return new NextResponse('Exam question not found', { status: 404 });
    }

    // Delete the exam question if found
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
