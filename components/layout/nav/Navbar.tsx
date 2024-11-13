"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import NavigationBar from "./navigation-bar";
import ActionButton from "./action-button";

const Navbar = () => {
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const pathname = usePathname();

  const handleScroll = () => {
    if (window.scrollY > lastScrollY && window.scrollY > 50) {
      setIsHidden(true);
    } else if (window.scrollY < lastScrollY && window.scrollY <= 50) {
      setIsHidden(false);
    }
    setLastScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <div
      className={`flex justify-between items-center px-10 border-b transition-transform duration-300 ${isHidden ? "-translate-y-full" : "translate-y-0"}`}
    >
      <Logo />
      <NavigationBar />
      <ActionButton />
    </div>
  );
};

export default Navbar;