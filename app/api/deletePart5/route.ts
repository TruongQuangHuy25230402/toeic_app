import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Đường dẫn import đến Prisma client của bạn


export async function DELETE(req: Request, { params }: { params: { examId: string } }) {
  try {
    // Kiểm tra nếu không có examId được truyền
    if (!params.examId) {
      return new NextResponse('Exam ID is required', { status: 400 });
    }

    // Xóa tất cả các bản ghi liên quan đến examId
    const deletedPart5s = await prisma.questionPart5.deleteMany({
      where: {
        examId: params.examId,
      },
    });

    // Trả về kết quả đã xóa
    return NextResponse.json(deletedPart5s);
  } catch (error) {
    console.log('Error at /api/part5/examId DELETE', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
