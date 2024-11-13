import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';  // Assuming you have a prisma instance

// GET route handler for dynamic 'id'
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params; // Access the 'id' from URL params

  if (!id) {
    return NextResponse.json({ message: "ID is required" }, { status: 400 });
  }

  try {
    const userAnswer = await prisma.userAnswer.findUnique({
      where: { id: id }, // Use 'id' in the query   
      include: {
        UserAnswerDetail: {
          include: {
            questionPart1: true,
            questionPart2: true,
            questionPart3: true,
            questionPart4: true,
            questionPart5: true,
            questionPart6: true,
            questionPart7: true,
          },
        }
      },
    });

    if (!userAnswer) {
      return NextResponse.json({ message: "User answer not found" }, { status: 404 });
    }

    return NextResponse.json(userAnswer);
  } catch (error) {
    console.error("Error fetching user answer:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
