import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';  // Assuming you have a prisma instance

// GET route handler for dynamic 'id'
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params; // Access the 'id' from URL params

  if (!id) {
    return NextResponse.json({ message: "ID is required" }, { status: 400 });
  }

  try {
    const userAnswer = await prisma.user_Answer.findUnique({
      where: { id: id }, // Use 'id' in the query   
      include: {
        UserAnswer_Detail: {
          include: {
            question: true
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
