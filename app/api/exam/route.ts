import prisma from "@/lib/prisma";
import { NextResponse } from "next/server"

export async function POST(reg: Request){
    try{
        const body = await reg.json();

        const exam = await prisma.exam.create({
            data: {
                ...body,
            }
        })
        return NextResponse.json(exam);
    } catch(error){
        console.log('Error at /api/exam POST', error)
        return new NextResponse('Internal Server Error', {status: 500})
    }
}

export async function GET() {
    try {
        const exams = await prisma.exam.findMany({
            include: {
                userAnswers: true
            },
        });

        // Return the topics as JSON
        return NextResponse.json({ exams });
    } catch (error) {
        console.error('Error at /api/exams/', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}



  