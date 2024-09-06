import prisma from "@/lib/prisma";
import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache";

export type Part1Props = {
  audioFile: string,
  imageFile: string,
  answer1: string,
  answer2: string,
  answer3: string,
  answer4: string,
  correctAnswer: string,
  explainAnswer: string,
};

export async function POST(reg: Request){
    try{

        const body = await reg.json();
       
        const part1 = await prisma.questionPart1.create({
            data: {
                ...body,
            }
        })
        return NextResponse.json(part1);
    } catch(error){
        console.log('Error at /api/part1 POST', error)
        return new NextResponse('Internal Server Error', {status: 500})
    }
}


  