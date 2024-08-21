"use client";

import { usePathname, useRouter } from "next/navigation";
import Logo from "./Logo";
import NavigationBar from "./navigation-bar";
import ActionButton from "./action-button";


const Navbar = () => {
  // Nếu không, hiển thị NavbarTest
  return (
    <div className="flex justify-between items-center px-10 border-b">
      <Logo />
      <NavigationBar />
      <ActionButton />
    </div>
  );
};

export default Navbar;
