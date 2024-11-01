import {prisma} from "@/lib/prisma"

export const getProgress = async (
    userId: string,
    courseId: string,

): Promise<number> =>{
    try {
        const publishedChapter = await prisma.chapter.findMany({
            where:{
                courseId: courseId,
                isPublished: true

            },
            select:{
                id: true
            }
        })

        const publishedChapterIds = publishedChapter.map((chapter)=>chapter.id)
        const validCompletedChapters = await prisma.userProgress.count({
            where: {
                userId: userId,
                chapterId: {
                    in: publishedChapterIds
                },
                isCompleted: true
            }
        })

        const progressPercentage = (validCompletedChapters/publishedChapterIds.length) * 100

        return progressPercentage
    }catch(error){
        console.log("Get_Progresss", error);
        return 0;
    }
}