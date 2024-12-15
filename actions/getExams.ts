import prisma from "@/lib/prisma";

//Lấy toàn bộ Exam có trong db bao gồm các câu hỏi 7 part
export const getExams = async(searchParams: {
    title: string;
})=>{
    try{
        const{title} = searchParams;
        const exams = await prisma.exam.findMany({
            where: {
                title:{
                    contains: title,
                },
            }, include: {
                part1s: true,
                part2s: true,
                part3s: true,
                part4s: true,
                part5s: true,
                part6s: true,
                part7s: true,
                userAnswers: true

            }
        })
        return exams;

    } catch(error: any){
        throw new Error(error)
    }
};