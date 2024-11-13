import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  // Check if userId is provided
  if (!userId) {
    return NextResponse.json({ message: "User ID is required" }, { status: 400 });
  }

  try {
    const details = await prisma.user_Answer.findMany({
      where: {
        userId: userId, // Filter by userId
      },
      select: {
        id: true,
        scoreListening: true,
        scoreReading: true,
        totalScore: true,
        numberCorrect: true,
        numberWrong: true,
        numberSkip: true,
        createdAt: true,
        updatedAt: true,
        timeTaken: true,
        exams: { // Fetch the title from Exam
          select: {
            title: true,
          },
        },
      },
    });

    // Return the details as JSON
    return NextResponse.json({ details });
  } catch (error) {
    console.error("Error at /api/userAnswer/", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
