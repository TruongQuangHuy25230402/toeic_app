import prisma from "@/lib/prisma";

// Truy xuất dữ liệu thông tin của bảng user
export const getUserId = async (userId: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,  // Sử dụng userId từ tham số đầu vào
            },
        });

        if (!user) {
            // Nếu không tìm thấy người dùng, trả về null hoặc bạn có thể tùy chỉnh thông báo
            return { message: "User not found" };
        }

        return user;
    } catch (error: any) {
        // Ghi lại lỗi gốc để dễ dàng kiểm tra khi gặp sự cố
        console.error("Error fetching user data:", error);
        throw new Error("Error fetching user data: " + error.message);
    }
};
