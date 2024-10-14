// pages/api/user.ts
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const clerkUser = await currentUser();

    const user = await prisma.user.findUnique({
        where: {
            clerkUserId: clerkUser?.id
          }
      });

    // Return the topics as JSON
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error at /api/topics/', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

