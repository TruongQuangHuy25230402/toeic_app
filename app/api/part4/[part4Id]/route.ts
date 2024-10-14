import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(reg: Request, {params}: {params: {part4Id: string}}){
    try {
        const body = await reg.json();

        if(!params.part4Id){
            return new NextResponse('Part4 Id is required', {status: 400})
        }

        const part4 = await prisma.questionPart4.update({
            where:{
                id: params.part4Id,
            },
            data: {...body},
        });
        return NextResponse.json(part4);
    } catch (error) {
        console.log('Error at /api/part4/part4Id PATCH', error)
        return new NextResponse('Internal Server Error', {status: 500})
    }
}

export async function DELETE(reg: Request, {params}: {params: {part4Id: string}}){
    try {
        
        

        if(!params.part4Id){
            return new NextResponse('part4 Id is required', {status: 400})
        }


        const part4 = await prisma.questionPart4.delete({
            where:{
                id: params.part4Id,
            },
        });
        return NextResponse.json(part4);
    } catch (error) {
        console.log('Error at /api/part4/part4Id DELETE', error)
        return new NextResponse('Internal Server Error', {status: 500})
    }
}