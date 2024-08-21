"use client";

import { usePathname } from "next/navigation";
import { fetchUsers } from "../app/(auth)/actions/fetchUsers";
import { useEffect } from "react";
import Navbar from "@/components/layout/nav/Navbar";
import Footer from "@/components/layout/footer/Footer";
import Container from "@/components/Container";
import SideNavbar from "@/components/SideNavbar";

function LayoutProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isPublicRoute = ["sign-in", "sign-up"].includes(
    pathname.split("/")[1]
  );

  const isAdminRoute = pathname.startsWith("/admin");

  // Bỏ qua LayoutProvider nếu là trang Admin
  if (isAdminRoute) {
    return <div className='min-h-screen w-full bg-white text-black flex'>
    <SideNavbar/>
    <div className="p-8 w-full">{children}</div>
  </div>; // Hoặc render một layout trống hoặc nội dung khác nếu cần
  }

  const getNavbar = () => {
    if (isPublicRoute) return null;
    return (
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>
    );
  };

  const getFooter = () => {
    if (isPublicRoute) return null;
    return <Footer />;
  };

  const getContent = () => {
    return <>{children}</>;
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {getNavbar()}
      {/* Ensure there is padding to push content below the fixed Navbar */}
      <main className={`flex-grow ${!isPublicRoute ? 'pt-16' : ''}`}>
        {getContent()}
      </main>
      {getFooter()}
    </div>
  );
}

export default LayoutProvider;

