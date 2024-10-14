import prisma from "@/lib/prisma";
import { NextResponse } from "next/server"


export async function POST(reg: Request){
    try{

        const body = await reg.json();
       
        const part4 = await prisma.questionPart4.create({
            data: {
                ...body,
            }
        })
        return NextResponse.json(part4);
    } catch(error){
        console.log('Error at /api/part4 POST', error)
        return new NextResponse('Internal Server Error', {status: 500})
    }
}


