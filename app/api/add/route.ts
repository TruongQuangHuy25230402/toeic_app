import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Check if the email already exists in the database
        const existingAdmin = await prisma.admin.findUnique({
            where: {
                email: body.email,
            },
        });

        if (existingAdmin) {
            // If the email already exists, return an error response
            return NextResponse.json(
                { message: "Email already exists." },
                { status: 400 }
            );
        }

        // If the email does not exist, proceed to create a new admin
        const newAdmin = await prisma.admin.create({
            data: {
                ...body,
            },
        });

        return NextResponse.json(newAdmin);
    } catch (error) {
        console.log('Error at /api/add POST', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
