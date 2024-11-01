import prisma from "@/lib/prisma";

export const getUserById = async (id: string) => {
    try {
        const userAnswer = await prisma.userAnswer.findUnique({
            where: {
                id: id,
            },
            include: {
                exam: {
                    include: {
                        part1s: true,
                        part2s: true,
                        part3s: true,
                        part4s: true,
                        part5s: true,
                        part6s: true,
                        part7s: true,
                    },
                },
                UserAnswerDetail: true, // Include UserAnswerDetail here
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
