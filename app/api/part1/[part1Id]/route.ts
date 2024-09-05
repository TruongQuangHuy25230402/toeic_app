import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(reg: Request, {params}: {params: {part1Id: string}}){
    try {
        const body = await reg.json();

        if(!params.part1Id){
            return new NextResponse('Part1 Id is required', {status: 400})
        }

        const part1 = await prisma.questionPart1.update({
            where:{
                id: params.part1Id,
            },
            data: {...body},
        });
        return NextResponse.json(part1);
    } catch (error) {
        console.log('Error at /api/part1/part1Id PATCH', error)
        return new NextResponse('Internal Server Error', {status: 500})
    }
}

export async function DELETE(reg: Request, {params}: {params: {part1Id: string}}){
    try {
        
        

        if(!params.part1Id){
            return new NextResponse('part1 Id is required', {status: 400})
        }


        const part1 = await prisma.questionPart1.delete({
            where:{
                id: params.part1Id,
            },
        });
        return NextResponse.json(part1);
    } catch (error) {
        console.log('Error at /api/part1/part1Id DELETE', error)
        return new NextResponse('Internal Server Error', {status: 500})
    }
}