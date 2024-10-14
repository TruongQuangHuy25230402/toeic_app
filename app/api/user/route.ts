// pages/api/user.ts
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic'; // Đây là phần thêm để chỉ định route động

export async function GET() {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: {
        clerkUserId: clerkUser?.id
      }
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    // Return the user as JSON
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error at /api/user/', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
