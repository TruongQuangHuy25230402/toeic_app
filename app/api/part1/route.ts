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
