import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(reg: Request, {params}: {params: {part2Id: string}}){
    try {
        const body = await reg.json();

        if(!params.part2Id){
            return new NextResponse('Part2 Id is required', {status: 400})
        }

        const part2 = await prisma.questionPart2.update({
            where:{
                id: params.part2Id,
            },
            data: {...body},
        });
        return NextResponse.json(part2);
    } catch (error) {
        console.log('Error at /api/part2/part2Id PATCH', error)
        return new NextResponse('Internal Server Error', {status: 500})
    }
}

export async function DELETE(reg: Request, {params}: {params: {part2Id: string}}){
    try {
        
        

        if(!params.part2Id){
            return new NextResponse('part2 Id is required', {status: 400})
        }


        const part2 = await prisma.questionPart2.delete({
            where:{
                id: params.part2Id,
            },
        });
        return NextResponse.json(part2);
    } catch (error) {
        console.log('Error at /api/part2/part2Id DELETE', error)
        return new NextResponse('Internal Server Error', {status: 500})
    }
}