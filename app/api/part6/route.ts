import prisma from "@/lib/prisma";
import { NextResponse } from "next/server"


export async function POST(reg: Request){
    try{

        const body = await reg.json();
       
        const part6 = await prisma.questionPart6.create({
            data: {
                ...body,
            }
        })
        return NextResponse.json(part6);
    } catch(error){
        console.log('Error at /api/part6 POST', error)
        return new NextResponse('Internal Server Error', {status: 500})
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
      const arr = await prisma.questionPart6.findMany({
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
      console.error('Error at /api/part6/', error);
      return new NextResponse('Internal Server Error', { status: 500 });
    }
  }


