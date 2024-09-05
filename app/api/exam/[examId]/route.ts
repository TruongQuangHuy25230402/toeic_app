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