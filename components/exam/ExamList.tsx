"use client";

import { ExamWithParts } from "./AddToeicExamForm";
import { useState } from "react";
import ExamCard from "./ExamCard";

const ExamList = ({ exams }: { exams: ExamWithParts[] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const ExamPerPage = 9; // Số lượng bài thi hiển thị trên mỗi trang

  // Tính chỉ số của bài thi đầu tiên và cuối cùng trên trang hiện tại
  const indexOfLastExam = currentPage * ExamPerPage;
  const indexOfFirstExam = indexOfLastExam - ExamPerPage;
  const currentExams = exams.slice(indexOfFirstExam, indexOfLastExam);

  // Hàm chuyển đến trang trước hoặc sau
  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
      {currentExams.map((exam) => (
        <div key={exam.id} className="flex justify-center">
          <ExamCard exam={exam} />
        </div>
      ))}
    </div>
  );
};

export default ExamList;
