import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server"

export async function POST(reg: Request){
    try{
        const body = await reg.json();
        const {userId} = auth();

        if(!userId){
            return new NextResponse('Unauthorized', {status: 401})
        }

        const exams = await prisma.exams.create({
            data: {
                ...body,
                userId
            }
        })
        return NextResponse.json(exams);
    } catch(error){
        console.log('Error at /api/exams POST', error)
        return new NextResponse('Internal Server Error', {status: 500})
    }
}

export async function GET() {
    try {
        const exams = await prisma.exams.findMany({
            select:{
                id: true,
                title: true,
                userId: true,
                createdAt: true,
                updatedAt: true,
            }
        });

        // Return the topics as JSON
        return NextResponse.json({ exams });
    } catch (error) {
        console.error('Error at /api/exams/', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}



  