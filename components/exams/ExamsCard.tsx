"use client";

import React, { useEffect, useState } from 'react';

import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Clock, Users, List, QuoteIcon } from 'lucide-react';
import apiClient from "@/lib/api-client";
import { USER_API_ROUTES } from "@/ultis/api-route";
import { ExamsWith } from './AddExams';

const ExamsCard = ({ exam }: { exam: ExamsWith }) => {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pathname = usePathname();
  const isMyExams = pathname.includes("my-exams");
  const router = useRouter();

  // Fetch user ID
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await apiClient.get(USER_API_ROUTES.GET_USER);
        if (response.data.user) {
          setCurrentUserId(response.data.user.id); // Giả sử ID người dùng được trả về trong response
        } else {
          setError("User not found");
        }
      } catch (error) {
        setError("Error fetching user info");
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Kiểm tra xem người dùng đã làm bài thi hay chưa
  const hasUserAnswers = currentUserId && (exam.user_Answers?.some(user_Answer => user_Answer.userId === currentUserId && user_Answer.examsId === exam.id) || false);

  console.log("Has User Answers:", hasUserAnswers);
console.log("Current User ID:", currentUserId);
  if (loading) return <div>Loading...</div>; // Hiển thị loading khi đang fetch dữ liệu
  if (error) return <div>{error}</div>; // Hiển thị lỗi nếu có

  return (
    <div
  onClick={() => !isMyExams && router.push(`/detail/${exam.id}`)}
  className={cn(
    "cursor-pointer transition hover:scale-105 w-full max-w-[180px]", // Giới hạn chiều rộng tối đa
    isMyExams && "cursor-default"
  )}
>
  <div className="flex flex-col gap-2 bg-background/50 border border-primary/10 rounded-lg p-4 w-full">
    {/* Tiêu đề */}
    <h3 className="font-semibold text-base">{exam.title}</h3>

    {/* Thời gian làm bài */}
    <div className="text-primary/90 text-sm flex items-center gap-2">
      <Clock size={20} /> 120 phút
    </div>

    {/* Số người đã làm */}
    <div className="text-primary/90 text-sm flex items-center gap-2">
      <Users size={20} /> {exam.user_Answers?.length || 0} lượt làm bài
    </div>

    {/* 7 phần thi */}
    <div className="text-primary/90 text-sm flex items-center gap-2">
      <List size={20} /> 7 phần
    </div>

    {/* 200 câu hỏi */}
    <div className="text-primary/90 text-sm flex items-center gap-2">
      <QuoteIcon size={20} /> 200 câu
    </div>

    {/* Nút chi tiết */}
    <button
      onClick={(e) => {
        e.stopPropagation(); // Prevents the parent div's onClick from triggering
        if (hasUserAnswers) {
          // Nếu đã có câu trả lời của người dùng, chuyển hướng tới trang /userAnswerT/{userId}
          if (currentUserId) {
            router.push(`/statistics/${currentUserId}`);
          }
        } else {
          // Nếu chưa có câu trả lời, chuyển hướng tới trang chi tiết của bài thi
          router.push(`/detail/${exam.id}`);
        }
      }}
      className="mt-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark text-sm"
    >
      {hasUserAnswers ? "Xem kết quả" : "Chi tiết"}
    </button>
  </div>
</div>

  );
};

export default ExamsCard;
