import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {

    const topics = await prisma.topicPart3.findMany({
        select: {
          id: true,
          name: true, // Ensure that the name field is being selected
        },
      });

    // Return the topics as JSON
    return NextResponse.json({ topics });
  } catch (error) {
    console.error('Error at /api/topics/', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
