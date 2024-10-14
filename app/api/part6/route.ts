import prisma from "@/lib/prisma";
import { NextResponse } from "next/server"


export async function POST(reg: Request){
    try{

        const body = await reg.json();
       
        const part6 = await prisma.questionPart6.create({
            data: {
                ...body,
            }
        })
        return NextResponse.json(part6);
    } catch(error){
        console.log('Error at /api/part6 POST', error)
        return new NextResponse('Internal Server Error', {status: 500})
    }
}


