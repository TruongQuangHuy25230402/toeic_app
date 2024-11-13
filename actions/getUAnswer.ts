import prisma from "@/lib/prisma";
 
export const getUAnswer = async()=>{
    try{
        const user_Answers = await prisma.user_Answer.findMany({
            
        })
        return user_Answers;

    } catch(error: any){
        throw new Error(error)
    }
};