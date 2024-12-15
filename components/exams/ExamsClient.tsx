"use client";

import router from "next/router";
import React, { useState, useEffect } from "react";
import { ExamsWith } from "./AddExams";
import FullTest from "./FullTest";
import PartialTest from "./PartialTest";
import axios from "axios";
import { ExamQuestion, Exams } from "@prisma/client";

interface Question {
  id: string;
  title: string;
  questionText: string;
  answer1:       string;
  answer2:       string;
  answer3:       string;
  answer4:       string;
  correctAnswer: string;      
  explainAnswer: string;
  part: string;
  // Add other fields you need here
}


const ExamClient = ({ exam }: { exam: ExamsWith }) => {
  // State để lưu tab hiện tại: "Thông tin đề thi" hoặc "Đáp án chi tiết"
  const [selectedTab, setSelectedTab] = useState<"info" | "answers">("info");

  

  // State để chọn "Làm Full test" hoặc "Làm từng phần"
  const [testMode, setTestMode] = useState<"full" | "partial">("full");

  // State để lưu trạng thái bắt đầu bài thi
  const [testStarted, setTestStarted] = useState(false);

  // State để lưu phần thời gian cho làm từng part
  const [timeLimit, setTimeLimit] = useState<number>(120);

  // State để lưu phần thi được chọn (cho mode "partial")
  const [selectedParts, setSelectedParts] = useState<number[]>([]);

  // State để theo dõi số lần làm đề thi
  const [testAttemptCount, setTestAttemptCount] = useState<number>(0);

  const [arr, setArr] = useState<Question[]>([]);


  // Hàm để chuyển đổi giữa các tab
  const handleTabChange = (tab: "info" | "answers") => {
    setSelectedTab(tab);
  };

  // Hàm để chọn chế độ làm bài
  const handleTestModeChange = (mode: "full" | "partial") => {
    setTestMode(mode);
  };

  // Hàm để bắt đầu làm bài thi
  const handleStartTest = () => {
    setTestStarted(true);

    // Tăng số lần làm đề thi lên 1 mỗi khi bắt đầu
    setTestAttemptCount((prevCount) => prevCount + 1);
  };

  // Hàm để xác nhận trước khi rời trang
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (testStarted) {
        e.preventDefault();
        e.returnValue = ""; // Yêu cầu hiển thị hộp thoại xác nhận mặc định của trình duyệt
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [testStarted]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // Gửi yêu cầu đến API với examId
        const response = await axios.get(`/api/exams/${exam.id}`);
        setArr(response.data.arr); // Cập nhật state với danh sách câu hỏi
        console.log(response.data.exams)
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, [exam.id]); // Khi examId thay đổi, useEffect sẽ chạy lại


  const handleBack = () => {
    if (testStarted) {
      const confirmLeave = window.confirm(
        "Bạn có chắc chắn muốn rời trang? Bài thi của bạn sẽ không được lưu."
      );
      if (!confirmLeave) {
        return; // Không rời khỏi trang nếu người dùng hủy
      }
    }
    router.back();
  };

  return (
    <div className="flex flex-col gap-6 pb-2">
      {!testStarted ? (
        <>
          <div className="rounded-lg mb-4">
            <h3 className="font-semibold text-xl md:text-3xl">{exam.title}</h3>
          </div>

          {/* Nút để chuyển đổi giữa Thông tin đề thi và Đáp án chi tiết */}
          <div className="flex gap-4 mb-4">
            <button
              className={`py-2 px-4 rounded ${
                selectedTab === "info"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => handleTabChange("info")}
            >
              Thông tin đề thi
            </button>
            
            
          </div>

          {/* Hiển thị nội dung dựa trên tab đã chọn */}
          {selectedTab === "info" ? (
            <div>
              <div className="rounded-lg mb-4">
                <p className="text-primary/90 mb-2">
                  Thời gian làm bài: 120 phút | 7 phần thi | 200 câu hỏi 
                </p>
              </div>

              <div>
              </div>

              {/* Chọn chế độ làm bài */}
              <div className="rounded-lg mb-4">
                <h4 className="text-lg font-semibold mb-2">
                  Chế độ làm bài:
                </h4>
                <div className="flex gap-4">
                  <button
                    className={`py-2 px-4 rounded ${
                      testMode === "full"
                        ? "bg-green-500 text-white"
                        : "bg-gray-200"
                    }`}
                    onClick={() => handleTestModeChange("full")}
                  >
                    Làm Full Test
                  </button>
                 
                </div>
              </div>

              {/* Hiển thị nội dung tương ứng với chế độ làm bài */}
              {testMode === "full" ? (
                <div className="p-4 bg-gray-100 rounded-lg">
                  <p>
                    Đây là bài thi Full Test. Hãy chuẩn bị làm bài thi toàn bộ
                    7 phần trong 120 phút.
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-gray-100 rounded-lg">
                  <p>
                    Bạn đã chọn làm Từng Phần. Hãy chọn phần thi và thời gian:
                  </p>

                  

                  {/* Chọn thời gian làm bài */}
                  <select
                    className="py-2 px-4 bg-gray-200 rounded"
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(parseInt(e.target.value))}
                  >
                    {[
                      5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75,
                      80, 85, 90, 95, 100, 120,
                    ].map((time) => (
                      <option key={time} value={time}>
                        {time} phút
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Nút bắt đầu bài thi */}
              <button
                className="mt-8 py-2 px-6 bg-blue-500 text-white rounded"
                onClick={handleStartTest}
                disabled={testMode === "partial" && selectedParts.length === 0}
              >
                Bắt đầu
              </button>
            </div>
          ) : (
            <div>
              {/* Nội dung Đáp án chi tiết */}
              <div className="rounded-lg mb-4">
                <PartialTest examId={exam.id}/>
              </div>
            </div>
          )}
        </>
      ) : (
        <div>
          {/* Hiển thị FullTestComponent hoặc PartialTestComponent */}
          {testMode === "full" ? (
            <FullTest exam={exam}  />
          ) : (
            <div></div>
          )}

          
        </div>
      )}
    </div>
  );
};

export default ExamClient;
