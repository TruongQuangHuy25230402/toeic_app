"use client";

import { Layout,Compass, List, BarChart } from "lucide-react";
import { usePathname } from "next/navigation";
import { SidebarItem } from "./sidebar-item";
const guestRoutes = [
  {
    icon: Layout,
    label: "Dashboard",
    href: "/lms",
  },
  {
    icon: Compass,
    label: "Browse",
    href: "/lms/search",
  },
];

const teacherRoutes = [
  {
    icon: List,
    label: "Courses",
    href: "/lms/teacher/courses",
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: "/lms/teacher/analytics",
  },
]
export const SidebarRoutes = () => {
  const pathName = usePathname()
  const isTeacherPage = pathName?.includes("teacher")
  const routes = isTeacherPage ? teacherRoutes : guestRoutes;
  return (
    <div className="flex flex-col w-full">
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon} 
          label={route.label}
          href={route.href}
        ></SidebarItem>
      ))}
    </div>
  );
};
