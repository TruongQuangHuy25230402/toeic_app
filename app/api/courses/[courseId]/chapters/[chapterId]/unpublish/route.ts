import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import {prisma} from "@/lib/prisma"

export async function PATCH(
    req: Request, 
    { params }: { params: { courseId: string, chapterId: string } }
) {
    try {
        const { userId } = auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const ownCourse = await prisma.course.findUnique({
            where: {
                id: params.courseId,
                userId
            }
        });
        if (!ownCourse) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const unpublishedChapter = await prisma.chapter.update({
            where: {
                id: params.chapterId,
                courseId: params.courseId
            },
            data: {
                isPublished: false,
            }
        });


        const publishedChapterInCourse = await prisma.chapter.findMany({
            where: {
                courseId: params.courseId,
                isPublished: true,
            }
        })
        if(!publishedChapterInCourse.length){
            await prisma.course.update({
                where: {
                    id: params.courseId,
                },
                data:{
                    isPublished:false
                }
            })
        }
        return NextResponse.json(unpublishedChapter);
    } catch (error) {
        console.error("Chapter_Unpublish:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
