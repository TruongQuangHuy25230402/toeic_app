import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(reg: Request) {
  try {
    const { userId } = auth();
    
    const body = await reg.json();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const questions = await prisma.ques.create({
      data: {
        ...body,
        userId: String(userId), // Ensure userId is added here
      },
    });

    return NextResponse.json(questions);
  } catch (error) {
    console.log('Error at /api/questions POST', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    // Lấy examId từ query string
    const { searchParams } = new URL(req.url);
    const examsId = searchParams.get("examsId"); // Lấy giá trị examId từ URL

    // Kiểm tra nếu không có examId thì trả về lỗi
    if (!examsId) {
      return new NextResponse("examsId is required", { status: 400 });
    }

    // Truy vấn dữ liệu từ Prisma với điều kiện lọc theo examId
    const arr = await prisma.questionsT.findMany({
      where: {
        examsId: examsId, // Lọc dữ liệu theo examId
      },
        select: {    
          answer1:true,        
          answer2:true,        
          answer3:true,        
          answer4:true,        
          correctAnswer:true,        // Đáp án đúng
          explainAnswer:true,  
        },
      });

    // Return the topics as JSON
    return NextResponse.json({ arr });
  } catch (error) {
    console.error('Error at /api/exams/', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
