import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(reg: Request, {params}: {params: {grammarId: string}}){
    try {
        const body = await reg.json();

        if(!params.grammarId){
            return new NextResponse('grammar Id is required', {status: 400})
        }

        const grammar = await prisma.grammar.update({
            where:{
                id: params.grammarId,
            },
            data: {...body},
        });
        return NextResponse.json(grammar);
    } catch (error) {
        console.log('Error at /api/grammar/grammarId PATCH', error)
        return new NextResponse('Internal Server Error', {status: 500})
    }
}

export async function DELETE(reg: Request, {params}: {params: {grammarId: string}}){
    try {
        
        if(!params.grammarId){
            return new NextResponse('grammar Id is required', {status: 400})
        }

        const grammar = await prisma.grammar.delete({
            where:{
                id: params.grammarId,
            },
        });
        return NextResponse.json(grammar);
    } catch (error) {
        console.log('Error at /api/grammar/grammarId DELETE', error)
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
