"use client";


import { useState } from "react";

import { User_Answer, UserAnswer } from "@prisma/client";
import { ExamsWith} from "./AddExams";
import ExamsCard from "./ExamsCard";

interface ExamsListProps {
  exams: ExamsWith[];
  user_Answers: User_Answer[] ; // Thêm kiểu cho userAnswers
}

const ExamsList = ({ exams, user_Answers }: ExamsListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const ExamPerPage = 9; // Số lượng bài thi hiển thị trên mỗi trang

  // Tính chỉ số của bài thi đầu tiên và cuối cùng trên trang hiện tại
  const indexOfLastExam = currentPage * ExamPerPage;
  const indexOfFirstExam = indexOfLastExam - ExamPerPage;
  const currentExams = exams.slice(indexOfFirstExam, indexOfLastExam);

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

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {currentExams.map((exam) => (
          <div key={exam.id} className="flex justify-center">
            <ExamsCard exam={exam} />
          </div>
        ))}
      </div>

      {/* Nút điều hướng */}
      <div className="flex justify-between mt-4">
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

export default ExamsList;
