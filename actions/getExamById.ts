import prisma from "@/lib/prisma";

// Truy xuất dữ liệu thông tin của bảng exam
export const getExamById = async(examId: string) => {
    try{
        const exam = await prisma.exam.findUnique({
            where: {
                id: examId,
            },

            include:{
                part1s: true,
                part2s: true,
                part3s: true,
                part4s: true,
                part5s: true,
                part6s: true,
                part7s: true,
                
            }
        });

        if(!exam) return null;

        return exam;

    } catch(error: any){
        throw new Error(error)
    }

};