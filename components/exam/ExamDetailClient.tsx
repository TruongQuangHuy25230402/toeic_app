"use client";

import router from "next/router";
import { ExamWithParts } from "./AddToeicExamForm";
import React, { useState, useEffect } from "react";
import FullTestComponent from "./FullTestComponent";
import PartialTestComponent from "./PartialTestComponent";
import apiClient from "@/lib/api-client";
import { USER_API_ROUTES } from "@/ultis/api-route";
import DetailUserAnswer from "./DetailUserAnswer";

type Topic = {
  id: string;
  name: string;
  // Các trường khác nếu cần
};

type TopicsState = {
  part1s: Topic[];
  part2s: Topic[];
  part3s: Topic[];
  part4s: Topic[];
  part5s: Topic[];
  part6s: Topic[];
  part7s: Topic[];
};


const ExamDetailClient = ({ exam }: { exam: ExamWithParts }) => {
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

  const [hasTwoExams, setHasTwoExams] = useState(false);

  const [topics, setTopics] = useState<TopicsState>({
    part1s: [],
    part2s: [],
    part3s: [],
    part4s: [],
    part5s: [],
    part6s: [],
    part7s: [],
  });

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
    const fetchTopics = async () => {
      try {
        const endpoints = [
          USER_API_ROUTES.GET_TOPICS_PART1,
          USER_API_ROUTES.GET_TOPICS_PART2,
          USER_API_ROUTES.GET_TOPICS_PART3,
          USER_API_ROUTES.GET_TOPICS_PART4,
          USER_API_ROUTES.GET_TOPICS_PART5,
          USER_API_ROUTES.GET_TOPICS_PART6,
          USER_API_ROUTES.GET_TOPICS_PART7,
        ];

        // Gọi tất cả các API cùng lúc
        const responses = await Promise.all(
          endpoints.map((endpoint) => apiClient.get(endpoint))
        );

        // Xử lý từng response và gán vào object topics
        const fetchedTopics = {
          part1s: responses[0]?.data?.topics || "No topic for Part 1",
          part2s: responses[1]?.data?.topics || "No topic for Part 2",
          part3s: responses[2]?.data?.topics || "No topic for Part 3",
          part4s: responses[3]?.data?.topics || "No topic for Part 4",
          part5s: responses[4]?.data?.topics || "No topic for Part 5",
          part6s: responses[5]?.data?.topics || "No topic for Part 6",
          part7s: responses[6]?.data?.topics || "No topic for Part 7",
        };

        setTopics(fetchedTopics); // Cập nhật state với dữ liệu topic đã lấy
        // Console log để xem dữ liệu hiện tại
        console.log("Fetched Topics:", fetchedTopics);
      } catch (error) {
        console.error("Error fetching topics:", error);
      }
    };

    fetchTopics();
  }, []);

  useEffect(() => {
    const fetchExamData = async () => {
    
      try {
        const response = await fetch(`/api/check?examId=${exam.id}`);
        const data = await response.json();
        setHasTwoExams(data.hasTwoExams); // Set the state based on response
      } catch (error) {
        console.error("Error fetching user answer data:", error);
      }
    };

    fetchExamData();
  }, [exam.id]);

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
                  Chọn chế độ làm bài:
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
                  <button
                    className={`py-2 px-4 rounded ${
                      testMode === "partial"
                        ? "bg-green-500 text-white"
                        : "bg-gray-200"
                    }`}
                    onClick={() => handleTestModeChange("partial")}
                  >
                    Làm Từng Phần
                  </button>
                </div>
              </div>

              {/* Hiển thị nội dung tương ứng với chế độ làm bài */}
              {testMode === "full" ? (
                <div className="p-4 bg-gray-100 rounded-lg">
                  <p>
                    Bạn đã chọn làm Full Test. Hãy chuẩn bị làm bài thi toàn bộ
                    7 phần trong 120 phút.
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-gray-100 rounded-lg">
                  <p>
                    Bạn đã chọn làm Từng Phần. Hãy chọn phần thi và thời gian:
                  </p>

                  <div className="mb-4">
                    {[
                      {
                        title: "Part 1",
                        questions: exam.part1s,
                        
                      },
                      {
                        title: "Part 2",
                        questions: exam.part2s,
                        
                      },
                      {
                        title: "Part 3",
                        questions: exam.part3s,
                      
                      },
                      {
                        title: "Part 4",
                        questions: exam.part4s,
                      
                      },
                      {
                        title: "Part 5",
                        questions: exam.part5s,
                      
                      },
                      {
                        title: "Part 6",
                        questions: exam.part6s,
                      
                      },
                      {
                        title: "Part 7",
                        questions: exam.part7s,
                      },
                    ]
                      .filter((part) => part.questions.length > 0)
                      .map((part, index) => (
                        <div key={index} className="my-4">
                          <div className="flex items-center">
                            <label className="ml-4">
                              <input
                                type="checkbox"
                                value={index + 1}
                                className="mr-2"
                                onChange={(e) => {
                                  const selected = parseInt(e.target.value);
                                  setSelectedParts((prev) =>
                                    prev.includes(selected)
                                      ? prev.filter((p) => p !== selected)
                                      : [...prev, selected]
                                  );
                                }}
                              />
                            </label>
                            <strong className="mr-2">{part.title}</strong>
                            <span>({part.questions.length} câu hỏi)</span>
                            
                          </div>
                        </div>
                      ))}
                  </div>

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
                className="py-2 px-6 bg-blue-500 text-white rounded"
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
                <h3 className="font-semibold text-xl md:text-2xl">
                  Chi tiết
                </h3>
              </div>
            </div>
          )}
        </>
      ) : (
        <div>
          {/* Hiển thị FullTestComponent hoặc PartialTestComponent */}
          {testMode === "full" ? (
            <FullTestComponent exam={exam}  />
          ) : (
            <PartialTestComponent
              exam={exam}
              selectedParts={selectedParts}
              timeLimit={timeLimit}
            />
          )}

          
        </div>
      )}
    </div>
  );
};

export default ExamDetailClient;
