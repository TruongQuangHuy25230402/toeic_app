import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {

    const details = await prisma.userAnswer_Detail.findMany({
        select: {
          selectedAnswer: true,
          questionId: true
        },
      });

    // Return the topics as JSON
    return NextResponse.json({ details });
  } catch (error) {
    console.error('Error at /api/userAnswerDetail/', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
