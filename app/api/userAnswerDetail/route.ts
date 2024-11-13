import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
  

    const details = await prisma.userAnswerDetail.findMany({
      select: {
        selectedAnswer: true,
        questionId: true,
        userAnswerId: true,
      },
    });

    return NextResponse.json({ details });
  } catch (error) {
    console.error("Error at /api/userAnswerDetail/", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
