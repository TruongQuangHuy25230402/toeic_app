import prisma from "@/lib/prisma";

export const getUsersById = async (id: string) => {
    try {
        const userAnswer = await prisma.user_Answer.findUnique({
            where: {
                id: id,
            },
            include: {
                exams: {
                    include: {
                        questions: true
                    },
                },
                UserAnswer_Detail: true, // Include UserAnswerDetail here
                user: true, // Include the user relationship
            },
        });

        if (!userAnswer) return null;

        return {
            ...userAnswer,
            userId: userAnswer.user.id, // Add userId to the returned object
        };
    } catch (error: any) {
        console.error("Error fetching userAnswer:", error);
        throw new Error("Failed to fetch user answer");
    }
};
