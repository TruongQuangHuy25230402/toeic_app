import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Giả sử bạn đã cấu hình Prisma client ở đây

export async function POST(req: Request) {
  try {
    // Lấy questionId từ body của request
    const { questionId } = await req.json(); // Đảm bảo rằng request body có chứa questionId

    // Kiểm tra nếu không có questionId thì trả về lỗi
    if (!questionId) {
      return new NextResponse("questionId is required", { status: 400 });
    }

    // Tạo một mảng để chứa thông tin chi tiết cho từng câu hỏi
    const questionDataList = [];

    // Lặp qua từng phần từ 1 đến 7
    for (let part = 1; part <= 7; part++) {
      // Đoạn này cần thay đổi
      const questionData = await (prisma as any)[
        `QuestionPart${part}`
      ].findFirst({
        where: { id: questionId },
        select: {
          answer1: true,
          answer2: true,
          answer3: true,
          answer4: true,
          correctAnswer: true,
          explainAnswer: true,
        },
      });
    console.log(`QuestionPart${part}:`, questionData); // Log kết quả mỗi phần
      // Nếu tìm thấy dữ liệu, thêm vào mảng questionDataList
      if (questionData) {
        questionDataList.push({
          part,
          ...questionData, // spread operator để thêm các trường từ questionData
        });
      }
    }

    

    // Kiểm tra nếu không tìm thấy dữ liệu
    if (questionDataList.length === 0) {
      return new NextResponse(
        "No question found for the provided questionId.",
        { status: 404 }
      );
    }

    // Trả về tất cả các chi tiết câu hỏi
    return NextResponse.json({ questions: questionDataList });
  } catch (error) {
    console.error("Error at /api/question/", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
