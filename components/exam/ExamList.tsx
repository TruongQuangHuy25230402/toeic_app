"use client";

import { ExamWithParts } from "./AddToeicExamForm";
import { useState } from "react";
import ExamCard from "./ExamCard";
import { UserAnswer } from "@prisma/client";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation"; // Import useRouter

interface ExamListProps {
  exams: ExamWithParts[];
  userAnswers: UserAnswer[] ; // Thêm kiểu cho userAnswers
}

const ExamList = ({ exams, userAnswers }: ExamListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const ExamPerPage = 9; // Số lượng bài thi hiển thị trên mỗi trang

  // Tính chỉ số của bài thi đầu tiên và cuối cùng trên trang hiện tại
  const indexOfLastExam = currentPage * ExamPerPage;
  const indexOfFirstExam = indexOfLastExam - ExamPerPage;
  const currentExams = exams.slice(indexOfFirstExam, indexOfLastExam);
  const router = useRouter(); // Sử dụng useRouter để điều hướng

  // Hàm chuyển đến trang trước hoặc sau
  const nextPage = () => {
    if (currentPage < Math.ceil(exams.length / ExamPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Hàm xử lý Random Test
  const handleRandomTest = () => {
      router.push(`details/cm371olq10000113ljzn9zzt2`); // Điều hướng đến đường dẫn với ID ngẫu nhiên
  };

  return (
    <div>
      <Button onClick={handleRandomTest}>Random Test</Button>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {currentExams.map((exam) => (
          <div key={exam.id} className="flex justify-center">
            <ExamCard exam={exam} />
          </div>
        ))}
      </div>

      {/* Nút điều hướng */}
      <div className="flex justify-between items-center mt-4 space-x-4">
  <button
    onClick={prevPage}
    disabled={currentPage === 1}
    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
  >
    Trang trước
  </button>
  <button
    onClick={nextPage}
    disabled={currentPage >= Math.ceil(exams.length / ExamPerPage)}
    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
  >
    Trang tiếp theo
  </button>
</div>


    </div>
  );
};

export default ExamList;
