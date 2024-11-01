import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(reg: Request, {params}: {params: {examId: string}}){
    try {
        const body = await reg.json();

        if(!params.examId){
            return new NextResponse('Exam Id is required', {status: 400})
        }

        const exam = await prisma.exam.update({
            where:{
                id: params.examId,
            },
            data: {...body},
        });
        return NextResponse.json(exam);
    } catch (error) {
        console.log('Error at /api/exam/examId PATCH', error)
        return new NextResponse('Internal Server Error', {status: 500})
    }
}

export async function DELETE(reg: Request, {params}: {params: {examId: string}}){
    try {
        
        if(!params.examId){
            return new NextResponse('Exam Id is required', {status: 400})
        }

        const exam = await prisma.exam.delete({
            where:{
                id: params.examId,
            },
        });
        return NextResponse.json(exam);
    } catch (error) {
        console.log('Error at /api/exam/examId DELETE', error)
        return new NextResponse('Internal Server Error', {status: 500})
    }
}

export async function GET(req: Request, { params }: { params: { examId: string } }) {
    const examId = params.examId;

    if (!examId) {
        return NextResponse.json({ message: "Exam ID is required" }, { status: 400 });
    }

    try {
        const exam = await prisma.exam.findUnique({
            where: { id: examId },
            include: { userAnswers: true },
        });

        if (!exam) {
            return NextResponse.json({ message: "Exam not found" }, { status: 404 });
        }

        return NextResponse.json({ exam });
    } catch (error) {
        console.error("Error fetching exam details:", error);
        return NextResponse.json({ message: "Internal Server Error", error: String(error) }, { status: 500 });
    }
}
