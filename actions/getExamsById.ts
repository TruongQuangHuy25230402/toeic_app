import prisma from "@/lib/prisma";

// Truy xuất dữ liệu thông tin của bảng exam
export const getExamsById = async (examsId: string) => {
    try {
        const exams = await prisma.exams.findUnique({
            where: {
                id: examsId,
                
            },
            include: {
                questions: true,
            }
            
            
        });

        if (!exams) return null;

        return exams;
    } catch (error: any) {
        throw new Error(error);
    }
};
