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

  