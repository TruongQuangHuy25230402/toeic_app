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

export async function getPart1s() {
    try {
      const part1s = await prisma.questionPart1.findMany();
      return part1s;
    } catch (error) {
      console.log(error);
    }
  }
  export async function createPart1(data: Part1Props) {
    try {
      const part1 = await prisma.questionPart1.create({
        data: {
          audioFile: data.audioFile,
          imageFile: data.imageFile,
          answer1: data.answer1,
          answer2: data.answer2,
          answer3: data.answer3,
          answer4: data.answer4,
          correctAnswer: data.correctAnswer,
          explainAnswer: data.explainAnswer,
        },
      });
      revalidatePath("/");
      return part1;
    } catch (error) {
      console.log(error);
    }
  }
  export async function createBulkUsers(part1s: Part1Props[]) {
    try {
      for (const part1 of part1s) {
        await createPart1(part1);
      }
    } catch (error) {
      console.log(error);
    }
  }
  export async function deletePart1() {
    try {
      await prisma.questionPart1.deleteMany();
      revalidatePath("/");
    } catch (error) {
      console.log(error);
    }
  }

  