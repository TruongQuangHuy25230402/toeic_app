import prisma from "@/lib/prisma";

//Lấy toàn bộ Exam có trong db bao gồm các câu hỏi 7 part
export const getExams = async()=>{
    try{
        const exams = await prisma.exam.findMany({
            where: {
                
            }, include: {
                part1s: true,
                part2s: true,
                part3s: true,
                part4s: true,
                part5s: true,
                part6s: true,
                part7s: true,

            }
        })
        return exams;

    } catch(error: any){
        throw new Error(error)
    }
};