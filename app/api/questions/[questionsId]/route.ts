import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(reg: Request, {params}: {params: {questionsId: string}}){
    try {
        const body = await reg.json();
        const {userId} = auth();

        if(!params.questionsId){
            return new NextResponse('questions Id is required', {status: 400})
        }

        if(!userId){
            return new NextResponse('Unauthorized', {status: 401})
        }

        const questions = await prisma.questionsT.update({
            where:{
                id: params.questionsId,
            },
            data: {...body},
        });
        return NextResponse.json(questions);
    } catch (error) {
        console.log('Error at /api/questions/questionsId PATCH', error)
        return new NextResponse('Internal Server Error', {status: 500})
    }
}

export async function DELETE(reg: Request, {params}: {params: {questionsId: string}}){
    try {
        
        const {userId} = auth();

        if(!params.questionsId){
            return new NextResponse('questions Id is required', {status: 400})
        }

        if(!userId){
            return new NextResponse('Unauthorized', {status: 401})
        }

        const questions = await prisma.questionsT.delete({
            where:{
                id: params.questionsId,
            },
        });
        return NextResponse.json(questions);
    } catch (error) {
        console.log('Error at /api/questions/questionsId DELETE', error)
        return new NextResponse('Internal Server Error', {status: 500})
    }
}