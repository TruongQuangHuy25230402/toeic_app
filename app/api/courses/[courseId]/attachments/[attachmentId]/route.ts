import { NextResponse } from 'next/server';
import { Attachment } from '@prisma/client';
import { auth } from '@clerk/nextjs/server';
import {prisma} from "@/lib/prisma"
import { isTeacher } from '@/lib/teacher';
export async function DELETE(
    req: Request,
    {params}: {params: {courseId: string, attachmentId: string}}
){
try {
    const {userId} = auth()
    if(!userId || isTeacher(userId)) {
        return new NextResponse("Unauthorized",{status: 401})
    }
    const courseOwner = await prisma.course.findUnique({
        where:{
            id: params.courseId,
            userId: userId
        }
    })
    if(!courseOwner)
    {
        return new NextResponse("Unauthorized",{status: 401})

    }
    const attachment = await prisma.attachment.delete({
        where:{
            courseId: params.courseId,
            id: params.attachmentId
        }
    })
    return NextResponse.json(attachment);
} catch (error) {
    console.log("ATTACHMENTID",error)
    return new NextResponse("Internal Server Error",{status:500})
}}