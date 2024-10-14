import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(reg: Request, {params}: {params: {part7Id: string}}){
    try {
        const body = await reg.json();

        if(!params.part7Id){
            return new NextResponse('Part7 Id is required', {status: 400})
        }

        const part7 = await prisma.questionPart7.update({
            where:{
                id: params.part7Id,
            },
            data: {...body},
        });
        return NextResponse.json(part7);
    } catch (error) {
        console.log('Error at /api/part7/part7Id PATCH', error)
        return new NextResponse('Internal Server Error', {status: 500})
    }
}

export async function DELETE(reg: Request, {params}: {params: {part7Id: string}}){
    try {
        
        

        if(!params.part7Id){
            return new NextResponse('part7 Id is required', {status: 400})
        }


        const part7 = await prisma.questionPart7.delete({
            where:{
                id: params.part7Id,
            },
        });
        return NextResponse.json(part7);
    } catch (error) {
        console.log('Error at /api/part7/part7Id DELETE', error)
        return new NextResponse('Internal Server Error', {status: 500})
    }
}