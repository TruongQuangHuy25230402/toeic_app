"use client";
import apiClient from "@/lib/api-client";
import { USER_API_ROUTES } from "@/ultis/api-route";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

// Define the types for user data
interface User {
  id: string;
  username: string;
  email: string;
  profilePic: string;
  clerkUserId: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserInfo = () => {
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // Sử dụng useRouter để điều hướng

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await apiClient.get(USER_API_ROUTES.GET_USER);

        if (response.data.user) {
          setUserInfo(response.data.user); // Set user info
        } else {
          setError("User not found");
        }
      } catch (error) {
        setError("Error fetching user info");
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false); // Ensure loading is set to false
      }
    };

    fetchUser();
  }, []);

  const handleStatisticsClick = () => {
    router.push("/statistics"); // Chuyển trang tới /statistics
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading user info: {error}</div>;

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-md rounded-lg">
      {userInfo ? (
        <div className="flex flex-col items-center">
          <img
            src={userInfo.profilePic || "/default-avatar.png"}
            alt="Profile Picture"
            className="w-12 h-12 rounded-full object-cover mb-4"
          />
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">{userInfo.username}</h2>
            <p className="text-gray-600 mb-2">{userInfo.email}</p>
            <p className="text-gray-400 text-sm">
              Joined on {new Date(userInfo.createdAt).toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </p>
            <Button
              onClick={handleStatisticsClick}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Thống kê kết quả
            </Button>
          </div>
        </div>
      ) : (
        <div>No user info available</div>
      )}
    </div>
  );
};

export default UserInfo;
