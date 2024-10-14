import prisma from "@/lib/prisma";
import { NextResponse } from "next/server"


export async function POST(reg: Request){
    try{

        const body = await reg.json();
       
        const part3 = await prisma.questionPart3.create({
            data: {
                ...body,
            }
        })
        return NextResponse.json(part3);
    } catch(error){
        console.log('Error at /api/part3 POST', error)
        return new NextResponse('Internal Server Error', {status: 500})
    }
}


