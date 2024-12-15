import prisma from "@/lib/prisma";

//Lấy toàn bộ Exam có trong db bao gồm các câu hỏi 7 part
export const getListExams = async(searchParams: {
    title: string;
})=>{
    try{
        const{title} = searchParams;
        const exams = await prisma.exams.findMany({
            where: {
                title:{
                    contains: title,
                },
            }, include: {
                questions: true,
                user_Answers: true

            }
        })
        return exams;

    } catch(error: any){
        throw new Error(error)
    }
};