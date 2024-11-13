import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(reg: Request) {
  try {
    const body = await reg.json();
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Check for duplicate data
    const existingQuestion = await prisma.ques.findFirst({
      where: {
        OR: [
          { title: body.title },
          { explainAnswer: body.explainAnswer }
        ]
      }
    });

    if (existingQuestion) {
      // Return duplicate question ID along with message
      return new NextResponse(
        JSON.stringify({
          message: `Duplicate question found (ID: ${existingQuestion.id}, Title: ${existingQuestion.title})`,
          questionId: existingQuestion.id,
        }),
        { status: 400 }
      );
    }

    // Create the new question if no duplicate found
    const ques = await prisma.ques.create({
      data: {
        ...body,
        userId,
      },
    });

    return NextResponse.json(ques);

  } catch (error) {
    console.log('Error at /api/ques POST', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}



export async function GET() {
  try {
    const questions = await prisma.ques.findMany({
      select: {
        id: true,
        questionText: true,
        title: true,
        answer1: true,
        answer2: true,
        answer3: true,
        answer4: true,
        correctAnswer: true,
        explainAnswer: true,
        part: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Return the topics as JSON
    return NextResponse.json({ questions });
  } catch (error) {
    console.error('Error at /api/ques/', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
