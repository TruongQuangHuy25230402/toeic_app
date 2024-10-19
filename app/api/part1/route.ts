import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Định nghĩa giới hạn số lượng phần tử
    const LIMIT = 6;

    // Kiểm tra số lượng phần tử hiện có trong cơ sở dữ liệu
    const count = await prisma.questionPart1.count();

    if (count >= LIMIT) {
      // Trả về thông báo lỗi nếu số lượng phần tử đã đạt giới hạn
      return new NextResponse('Exceeded the maximum number of elements', { status: 400 });
    }

    // Nếu số lượng phần tử chưa đạt giới hạn, thực hiện tạo dữ liệu mới
    const part1 = await prisma.questionPart1.create({
      data: {
        ...body,
      },
    });

    return NextResponse.json(part1);
  } catch (error) {
    console.log('Error at /api/part1 POST', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    // Lấy examId từ query string
    const { searchParams } = new URL(req.url);
    const examId = searchParams.get("examId"); // Lấy giá trị examId từ URL

    // Kiểm tra nếu không có examId thì trả về lỗi
    if (!examId) {
      return new NextResponse("examId is required", { status: 400 });
    }

    // Truy vấn dữ liệu từ Prisma với điều kiện lọc theo examId
    const arr = await prisma.questionPart1.findMany({
      where: {
        examId: examId, // Lọc dữ liệu theo examId
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
    console.error('Error at /api/part1/', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

