"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import apiClient from "@/lib/api-client";
import { ADMIN_API_ROUTES } from "@/ultis/api-route";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast"; // For toast notifications

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({ email: "", password: "" }); // Error state for email and password
  const router = useRouter();

  const validateFields = () => {
    const newError = { email: "", password: "" };
    let valid = true;

    if (!email) {
      newError.email = "Email is required.";
      valid = false;
    }
    if (!password) {
      newError.password = "Password is required.";
      valid = false;
    }

    setError(newError);
    return valid;
  };

  const handleLogin = async () => {
    if (!validateFields()) return;

    try {
      const response = await apiClient.post(ADMIN_API_ROUTES.LOGIN, {
        email,
        password,
      });

      if (response.data.userInfo) {
        // Successful login, redirect to dashboard
        router.push("/admin/dashboard");
      } else {
        alert("Login failed. Please check your credentials.");
      }
    } catch (error) {
      alert("An error occurred during login. Please try again.");
      console.error("Login error:", error);
    }
  };

  return (
    <div
      className="h-screen w-full flex items-center justify-center bg-cover bg-no-repeat"
      style={{ backgroundImage: 'url("/home/home-bg.png")' }}
    >
      <div className="absolute w-full inset-0 flex justify-center items-center bg-white bg-opacity-50 backdrop-blur-2xl">
        <Card className="shadow-2xl bg-opacity-20 w-80">
          <CardHeader className="flex flex-col gap-4 capitalize text-3xl items-center">
            <div className="flex flex-col gap-1 items-center">
            
              <div className="text-xl uppercase font-medium italic text-black">
                <span>CodeQuiz Admin Login</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex flex-col items-center w-full justify-center">
            <div className="flex flex-col gap-2 w-full mb-4">
              <Input
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={error.email && "border-red-500"}
              />
              {error.email && <p className="text-red-500 text-sm">{error.email}</p>}
            </div>

            <div className="flex flex-col gap-2 w-full">
              <Input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={error.password && "border-red-500"}
              />
              {error.password && <p className="text-red-500 text-sm">{error.password}</p>}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-2 items-center justify-center">
            <Button
              className="w-full capitalize"
              onClick={handleLogin}
            >
              Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
