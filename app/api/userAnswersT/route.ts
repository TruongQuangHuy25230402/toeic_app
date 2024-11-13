// pages/api/userAnswers.ts
import prisma from "@/lib/prisma"; // Đảm bảo bạn đã cấu hình Prisma
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result = await prisma.user_Answer.create({
      data: {
        userId: body.userId, // Đảm bảo userId có trong body
        examsId: body.examsId,
        scoreListening: body.scoreListening,
        scoreReading: body.scoreReading,
        totalScore: body.totalScore,
        numberCorrect: body.numberCorrect,
        numberWrong: body.numberWrong,
        numberSkip: body.numberSkip,
        timeTaken: body.timeTaken,
        createdAt: new Date(),
        updatedAt: new Date(),
        UserAnswer_Detail: {
          create: body.userAnswer_Detail, // Lưu từng chi tiết câu trả lời
        },
      },
    });

    console.log("Saving UserAnswer:");
    console.log("Updating participantCount for examId:", body.examId);

    // Cập nhật số lượng người làm bài cho Exam
    

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error saving user answers:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id"); // Lấy id từ query params

  if (!id) {
    return NextResponse.json({ message: "ID is required" }, { status: 400 });
  }

  try {
    const userAnswer = await prisma.user_Answer.findUnique({
      where: { id: id }, // Tìm kiếm theo id
      include: {
        UserAnswer_Detail: true, // Bao gồm thông tin chi tiết câu trả lời
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
