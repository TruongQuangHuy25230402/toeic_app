import prisma from "@/lib/prisma";
import { NextResponse } from "next/server"

export async function POST(reg: Request){
    try{
        const body = await reg.json();

        const contact = await prisma.contact.create({
            data: {
                ...body,
            }
        })
        return NextResponse.json(contact);
    } catch(error){
        console.log('Error at /api/contact POST', error)
        return new NextResponse('Internal Server Error', {status: 500})
    }
}

export async function GET() {
    try {
        const contacts = await prisma.contact.findMany({
           
        });

        // Return the topics as JSON
        return NextResponse.json({ contacts });
    } catch (error) {
        console.error('Error at /api/contacts/', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}



  