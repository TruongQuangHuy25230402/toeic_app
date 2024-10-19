"use client";

import { usePathname } from "next/navigation";
import { fetchUsers } from "../app/(auth)/actions/fetchUsers";
import { useEffect } from "react";
import Navbar from "@/components/layout/nav/Navbar";
import Footer from "@/components/layout/footer/Footer";
import SideNavbar from "@/components/SideNavbar";
import Container from "@/components/Container"; // Giả sử bạn có một container riêng cho layout

function LayoutProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Xác định nếu là đường dẫn admin
  const isAdminRoute = pathname.startsWith("/admin");

  // Xác định nếu là đường dẫn exam
  const isExamRoute = pathname.startsWith("/exam");

  // Xác định nếu là đường dẫn exam
  const isUploadRoute = pathname.startsWith("/upload");

  // Xác định nếu là trang chủ
  const isHomePage = pathname === "/";

  // Bỏ qua LayoutProvider nếu là trang Admin
  if (isAdminRoute) {
    return (
      <div className='min-h-screen w-full bg-white text-black flex'>
        <SideNavbar />
        <div className="p-8 w-full">{children}</div>
      </div>
    );
  }

  // Layout riêng cho trang /exam
  if (isExamRoute) {
    return (
      <div className="min-h-screen w-full flex flex-col bg-exam-background">
        <header className="w-full">
          {/* Nếu cần có header riêng cho trang exam */}
        </header>
        <main className="flex-grow w-full p-4">
          {children}
        </main>
        <footer className="w-full">
          {/* Nếu cần có footer riêng cho trang exam */}
        </footer>
      </div>
    );
  }

  // Hàm lấy Navbar - chỉ bỏ qua /admin và /exam
  const getNavbar = () => {
    if (isAdminRoute || isExamRoute || isUploadRoute) return null;
    return (
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>
    );
  };

  // Hàm lấy Footer - chỉ bỏ qua /admin và /exam
  const getFooter = () => {
    if (isAdminRoute || isExamRoute || isUploadRoute) return null;
    return <Footer />;
  };

  // Hàm lấy nội dung chính
  const getContent = () => {
    return <>{children}</>;
  };

  // Hàm lấy thông tin người dùng
  const getCurrentUser = async () => {
    try {
      const response: any = await fetchUsers();
      if (response.error) throw new Error(response.error.message);
    } catch (error) {
      console.log(error);
    } finally {
      return;
    }
  };

  useEffect(() => {
    if (!isAdminRoute && !isExamRoute) getCurrentUser();
  }, [pathname]);

  return (
    <div className={`min-h-screen flex flex-col w-full ${isHomePage ? 'bg-home-background' : 'bg-default-background'}`}>
      {getNavbar()}
      <main className={`flex-grow ${!isAdminRoute && !isExamRoute ? 'pt-16 pb-16' : 'pb-16'} px-4`}
      style={{ minHeight: 'calc(100vh - 64px - 64px)' }}>
        {getContent()}
      </main>
      {getFooter()}
    </div>
  );
}

export default LayoutProvider;
