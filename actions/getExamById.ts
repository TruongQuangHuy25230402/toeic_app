import prisma from "@/lib/prisma";

// Truy xuất dữ liệu thông tin của bảng exam
export const getExamById = async (examId: string) => {
    try {
        const exam = await prisma.exam.findUnique({
            where: {
                id: examId,
            },
            include: {
                part1s: {
                    include: {
                        Topic: true, // Bao gồm thông tin Topic cho Part 1
                    },
                },
                part2s: {
                    include: {
                        Topic: true, // Bao gồm thông tin Topic cho Part 2
                    },
                },
                part3s: {
                    include: {
                        Topic: true, // Bao gồm thông tin Topic cho Part 3
                    },
                },
                part4s: {
                    include: {
                        Topic: true, // Bao gồm thông tin Topic cho Part 4
                    },
                },
                part5s: {
                    include: {
                        Topic: true, // Bao gồm thông tin Topic cho Part 5
                    },
                },
                part6s: {
                    include: {
                        Topic: true, // Bao gồm thông tin Topic cho Part 6
                    },
                },
                part7s: {
                    include: {
                        Topic: true, // Bao gồm thông tin Topic cho Part 7
                    },
                },
            },
        });

        if (!exam) return null;

        return exam;
    } catch (error: any) {
        throw new Error(error);
    }
};
