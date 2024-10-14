import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(reg: Request, {params}: {params: {part3Id: string}}){
    try {
        const body = await reg.json();

        if(!params.part3Id){
            return new NextResponse('Part3 Id is required', {status: 400})
        }

        const part3 = await prisma.questionPart3.update({
            where:{
                id: params.part3Id,
            },
            data: {...body},
        });
        return NextResponse.json(part3);
    } catch (error) {
        console.log('Error at /api/part3/part3Id PATCH', error)
        return new NextResponse('Internal Server Error', {status: 500})
    }
}

export async function DELETE(reg: Request, {params}: {params: {part3Id: string}}){
    try {
        
        

        if(!params.part3Id){
            return new NextResponse('part3 Id is required', {status: 400})
        }


        const part3 = await prisma.questionPart3.delete({
            where:{
                id: params.part3Id,
            },
        });
        return NextResponse.json(part3);
    } catch (error) {
        console.log('Error at /api/part3/part3Id DELETE', error)
        return new NextResponse('Internal Server Error', {status: 500})
    }
}