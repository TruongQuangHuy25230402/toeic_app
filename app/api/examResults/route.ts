// pages/api/examResults.ts
import prisma from "@/lib/prisma"; // Đảm bảo bạn đã cấu hình Prisma
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const result = await prisma.examResult.create({
      data: {
        userId: body.userId,
        examId: body.examId,
        scoreListening: body.scoreListening,
        scoreReading: body.scoreReading,
        totalScore: body.totalScore,
        numberCorrect: body.numberCorrect,
        numberWrong: body.numberWrong,
        numberSkip: body.numberSkip,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error saving exam result:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
