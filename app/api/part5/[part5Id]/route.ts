import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(reg: Request, {params}: {params: {part5Id: string}}){
    try {
        const body = await reg.json();

        if(!params.part5Id){
            return new NextResponse('Part5 Id is required', {status: 400})
        }

        const part5 = await prisma.questionPart5.update({
            where:{
                id: params.part5Id,
            },
            data: {...body},
        });
        return NextResponse.json(part5);
    } catch (error) {
        console.log('Error at /api/part5/part5Id PATCH', error)
        return new NextResponse('Internal Server Error', {status: 500})
    }
}

export async function DELETE(reg: Request, {params}: {params: {part5Id: string}}){
    try {
        
        

        if(!params.part5Id){
            return new NextResponse('part5 Id is required', {status: 400})
        }


        const part5 = await prisma.questionPart5.delete({
            where:{
                id: params.part5Id,
            },
        });
        return NextResponse.json(part5);
    } catch (error) {
        console.log('Error at /api/part5/part5Id DELETE', error)
        return new NextResponse('Internal Server Error', {status: 500})
    }
}