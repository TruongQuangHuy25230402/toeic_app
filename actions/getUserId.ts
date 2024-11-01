import prisma from "@/lib/prisma";

// Truy xuất dữ liệu thông tin của bảng user
export const getUserId = async (userId: string) => { // Corrected the parameter name to userId
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId, // This matches the parameter name
            },
        });

        if (!user) return null;

        return user;
    } catch (error: any) {
        throw new Error(error);
    }
};
