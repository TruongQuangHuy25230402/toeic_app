import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const { userId } = auth(); // Extract userId from Clerk authentication

  const examId = searchParams.get("examId"); // Get examId from query parameters

  // Validate if examId and userId are provided
  if (!examId || !userId) {
    return NextResponse.json({ message: "User ID and Exam ID are required" }, { status: 400 });
  }

  try {
    // Fetch distinct exams where the user has answers for the given examId
    const userAnswers = await prisma.userAnswer.findMany({
      where: {
        userId: userId, // Filter by userId
        examId: examId,  // Ensure we filter by the specific examId
      },
      select: {
        examId: true, // Only select the examId
      },
      distinct: ['examId'], // Ensure each examId is distinct
    });

    // Check if the user has answered for more than 1 distinct exam
    const hasTwoExams = userAnswers.length >= 2;

    // Return whether the user has answers for two or more distinct exams
    return NextResponse.json({ hasTwoExams });
  } catch (error) {
    console.error("Error fetching user answers:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
