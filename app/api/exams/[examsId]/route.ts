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

