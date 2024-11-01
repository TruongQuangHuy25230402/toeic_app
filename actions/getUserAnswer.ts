import prisma from "@/lib/prisma";
 
export const getUserAnswer = async()=>{
    try{
        const userAnswers = await prisma.userAnswer.findMany({
            
        })
        return userAnswers;

    } catch(error: any){
        throw new Error(error)
    }
};