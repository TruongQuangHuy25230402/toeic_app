import prisma from "@/lib/prisma";

// Truy xuất dữ liệu thông tin của bảng exam
export const getQuesById = async (quesId: string) => {
    try {
        const ques = await prisma.ques.findUnique({
            where: {
                id: quesId,
             },
            
            
        });

        if (!ques) return null;

        return ques;
    } catch (error: any) {
        throw new Error(error);
    }
};
