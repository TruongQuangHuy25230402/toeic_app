
"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Admin = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return <div className="pt-8">DASHBOARD</div>;
};

export default Admin;

