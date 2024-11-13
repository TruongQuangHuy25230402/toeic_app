import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();


        // If the email does not exist, proceed to create a new admin
        const vocabulary = await prisma.vocabulary.create({
            data: {
                ...body,
            },
        });

        return NextResponse.json(vocabulary);
    } catch (error) {
        console.log('Error at /api/vocabulary POST', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}


export async function GET() {
  try {

    const vocabulary = await prisma.vocabulary.findMany({
        select: {
          id: true,
          title: true,
          content: true,
        },
      });

    // Return the topics as JSON
    return NextResponse.json({ vocabulary });
  } catch (error) {
    console.error('Error at /api/vocabulary/', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
