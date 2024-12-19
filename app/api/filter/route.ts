import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const startDate = searchParams.get("startDate");
  const range = searchParams.get("range");

  // Kiểm tra userId
  if (!userId) {
    return NextResponse.json({ message: "User ID is required" }, { status: 400 });
  }

  try {
    let filterCondition: any = {
      userId: userId,
    };

    // Tính toán startDate từ range nếu có
    if (range) {
      const days = parseInt(range, 10);
      const calculatedStartDate = new Date();
      calculatedStartDate.setDate(calculatedStartDate.getDate() - days);
      filterCondition.createdAt = {
        gte: calculatedStartDate, // Lọc các dữ liệu có createdAt >= calculatedStartDate
      };
    }

    // Nếu startDate được cung cấp
    if (startDate) {
      filterCondition.createdAt = {
        gte: new Date(startDate), // Lọc các dữ liệu có createdAt >= startDate
      };
    }

    // Truy vấn dữ liệu với Prisma
    const filteredData = await prisma.userAnswer.findMany({
      where: filterCondition,
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
        exam: {
          select: {
            title: true,
          },
        },
      },
    });

    // Trả về dữ liệu đã lọc
    return NextResponse.json({ filteredData });
  } catch (error) {
    console.error("Error at /api/userAnswerFiltered/", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
