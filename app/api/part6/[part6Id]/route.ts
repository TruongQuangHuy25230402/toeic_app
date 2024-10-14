import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(reg: Request, {params}: {params: {part6Id: string}}){
    try {
        const body = await reg.json();

        if(!params.part6Id){
            return new NextResponse('Part6 Id is required', {status: 400})
        }

        const part6 = await prisma.questionPart6.update({
            where:{
                id: params.part6Id,
            },
            data: {...body},
        });
        return NextResponse.json(part6);
    } catch (error) {
        console.log('Error at /api/part6/part6Id PATCH', error)
        return new NextResponse('Internal Server Error', {status: 500})
    }
}

export async function DELETE(reg: Request, {params}: {params: {part6Id: string}}){
    try {
        
        

        if(!params.part6Id){
            return new NextResponse('part6 Id is required', {status: 400})
        }


        const part6 = await prisma.questionPart6.delete({
            where:{
                id: params.part6Id,
            },
        });
        return NextResponse.json(part6);
    } catch (error) {
        console.log('Error at /api/part6/part6Id DELETE', error)
        return new NextResponse('Internal Server Error', {status: 500})
    }
}