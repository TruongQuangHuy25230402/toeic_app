import prisma from "@/lib/prisma";
import { NextResponse } from "next/server"


export async function POST(reg: Request){
    try{

        const body = await reg.json();
       
        const part7 = await prisma.questionPart7.create({
            data: {
                ...body,
            }
        })
        return NextResponse.json(part7);
    } catch(error){
        console.log('Error at /api/part7 POST', error)
        return new NextResponse('Internal Server Error', {status: 500})
    }
}


