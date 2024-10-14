import prisma from "@/lib/prisma";
import { NextResponse } from "next/server"


export async function POST(reg: Request){
    try{

        const body = await reg.json();
       
        const part2 = await prisma.questionPart2.create({
            data: {
                ...body,
            }
        })
        return NextResponse.json(part2);
    } catch(error){
        console.log('Error at /api/part2 POST', error)
        return new NextResponse('Internal Server Error', {status: 500})
    }
}


