import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(reg: Request, {params}: {params: {vocabularyId: string}}){
    try {
        const body = await reg.json();

        if(!params.vocabularyId){
            return new NextResponse('vocabulary Id is required', {status: 400})
        }

        const vocabulary = await prisma.vocabulary.update({
            where:{
                id: params.vocabularyId,
            },
            data: {...body},
        });
        return NextResponse.json(vocabulary);
    } catch (error) {
        console.log('Error at /api/vocabulary/vocabularyId PATCH', error)
        return new NextResponse('Internal Server Error', {status: 500})
    }
}

export async function DELETE(reg: Request, {params}: {params: {vocabularyId: string}}){
    try {
        
        if(!params.vocabularyId){
            return new NextResponse('vocabulary Id is required', {status: 400})
        }

        const vocabulary = await prisma.vocabulary.delete({
            where:{
                id: params.vocabularyId,
            },
        });
        return NextResponse.json(vocabulary);
    } catch (error) {
        console.log('Error at /api/vocabulary/vocabularyId DELETE', error)
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
