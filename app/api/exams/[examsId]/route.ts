import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(reg: Request, {params}: {params: {examsId: string}}){
    try {
        const body = await reg.json();

        if(!params.examsId){
            return new NextResponse('exams Id is required', {status: 400})
        }

        const exams = await prisma.exams.update({
            where:{
                id: params.examsId,
            },
            data: {...body},
        });
        return NextResponse.json(exams);
    } catch (error) {
        console.log('Error at /api/exams/examsId PATCH', error)
        return new NextResponse('Internal Server Error', {status: 500})
    }
}

export async function DELETE(reg: Request, {params}: {params: {examsId: string}}){
    try {
        
        if(!params.examsId){
            return new NextResponse('exams Id is required', {status: 400})
        }

        const exams = await prisma.exams.delete({
            where:{
                id: params.examsId,
            },
        });
        return NextResponse.json(exams);
    } catch (error) {
        console.log('Error at /api/exams/examsId DELETE', error)
        return new NextResponse('Internal Server Error', {status: 500})
    }
}

export async function GET(req: Request, { params }: { params: { examsId: string } }) {
    const examsId = params.examsId;
    console.log("Received examsId:", examsId); // Verify if examsId is received

    if (!examsId) {
        return NextResponse.json({ message: "Exam ID is required" }, { status: 400 });
    }

    try {
        // Fetch all questions where examId matches the provided examsId
        const exams = await prisma.examQuestion.findMany({
            where: { examId: examsId },
            select: {
                ques: true, // Include related question data
            }
        });

        console.log("Prisma exam result:", exams); // Log the exam data received from the database

        if (exams.length === 0) {
            return NextResponse.json({ message: "No questions found for this exam" }, { status: 404 });
        }

        return NextResponse.json({ exams });
    } catch (error) {
        console.error("Error fetching exam details:", error);
        return NextResponse.json({ message: "Internal Server Error", error: String(error) }, { status: 500 });
    }
}



