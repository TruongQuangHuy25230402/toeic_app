import prisma from "@/lib/prisma";

export const getAnswer = async()=>{
    try{
        const answers = await prisma.userAnswerDetail.findMany({
            where: {
                
            }, include: {
                questionPart1: true,
                questionPart2: true,
                questionPart3: true,
                questionPart4: true,
                questionPart5: true,
                questionPart6: true,
                questionPart7: true,

            }
        })
        return answers;

    } catch(error: any){
        throw new Error(error)
    }
};