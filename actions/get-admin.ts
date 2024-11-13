import prisma from "@/lib/prisma";

// Truy xuất dữ liệu thông tin của bảng exam
export const getAdminById = async (adminId: string) => {
    try {
        const admin = await prisma.admin.findUnique({
            where: {
                id: adminId,
            },
            
        });

        if (!admin) return null;

        return admin;
    } catch (error: any) {
        throw new Error(error);
    }
};
