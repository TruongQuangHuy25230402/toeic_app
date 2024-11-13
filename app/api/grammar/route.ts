import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();


        // If the email does not exist, proceed to create a new admin
        const grammar = await prisma.grammar.create({
            data: {
                ...body,
            },
        });

        return NextResponse.json(grammar);
    } catch (error) {
        console.log('Error at /api/grammar POST', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

export async function GET() {
    try {
  
      const grammar = await prisma.grammar.findMany({
          select: {
            id: true,
            title: true,
            content: true,
          },
        });
  
      // Return the topics as JSON
      return NextResponse.json({ grammar });
    } catch (error) {
      console.error('Error at /api/grammar/', error);
      return new NextResponse('Internal Server Error', { status: 500 });
    }
  }