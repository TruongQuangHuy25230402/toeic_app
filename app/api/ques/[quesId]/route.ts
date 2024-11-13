import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function PATCH(reg: Request, {params}: {params: {quesId: string}}){
    try {
        const body = await reg.json();

        const {userId} = auth();

        if(!userId){
            return new NextResponse('Unauthorized', {status: 401})
        }

        if(!params.quesId){
            return new NextResponse('Exam Id is required', {status: 400})
        }

        const ques = await prisma.ques.update({
            where:{
                id: params.quesId,
            },
            data: {...body},
        });
        return NextResponse.json(ques);
    } catch (error) {
        console.log('Error at /api/ques/quesId PATCH', error)
        return new NextResponse('Internal Server Error', {status: 500})
    }
}

export async function DELETE(reg: Request, {params}: {params: {quesId: string}}){
    try {
        
        if(!params.quesId){
            return new NextResponse('Exam Id is required', {status: 400})
        }

        const ques = await prisma.ques.delete({
            where:{
                id: params.quesId,
            },
        });
        return NextResponse.json(ques);
    } catch (error) {
        console.log('Error at /api/ques/quesId DELETE', error)
        return new NextResponse('Internal Server Error', {status: 500})
    }
}

export async function GET(req: Request, { params }: { params: { quesId: string } }) {
    const quesId = params.quesId;

    if (!quesId) {
        return NextResponse.json({ message: "Exam ID is required" }, { status: 400 });
    }

    try {
        const ques = await prisma.ques.findUnique({
            where: { id: quesId },
           
        });

        if (!ques) {
            return NextResponse.json({ message: "Exam not found" }, { status: 404 });
        }

        return NextResponse.json({ ques });
    } catch (error) {
        console.error("Error fetching exam details:", error);
        return NextResponse.json({ message: "Internal Server Error", error: String(error) }, { status: 500 });
    }
}
