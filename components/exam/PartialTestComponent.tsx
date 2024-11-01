import React, { useEffect, useState } from "react";
import Result from "./Result";
import DictionaryPopup from "./dictionary";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import {
  Exam,
  QuestionPart1,
  QuestionPart2,
  QuestionPart3,
  QuestionPart4,
  QuestionPart5,
  QuestionPart6,
  QuestionPart7,
} from "@prisma/client";
import { useRouter } from "next/navigation";
import HighlightableText from "../HighlightableAnswer";

type Question =
  | QuestionPart1
  | QuestionPart2
  | QuestionPart3
  | QuestionPart4
  | QuestionPart5
  | QuestionPart6
  | QuestionPart7;

  interface UserAnswerDetail {
    questionId: string; // Hoặc kiểu dữ liệu tương ứng
    selectedAnswer: string;
    isCorrect: boolean;
    isSkipped: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
  
  interface UserAnswer {
    id: string | null; // Bắt buộc
    userId: string;
    examId: string | null;
    scoreListening: number;
    scoreReading: number;
    totalScore: number;
    numberCorrect: number;
    numberWrong: number;
    numberSkip: number;
    createdAt: Date;
    updatedAt: Date;
    userAnswerDetail: UserAnswerDetail[]; // Đảm bảo có thuộc tính này
  }



const PartialTestComponent = ({
  timeLimit,
  selectedParts,
  exam,
}: { 
  timeLimit: number;
  selectedParts: number[];
  exam: {
    part1s: QuestionPart1[];
  part2s: QuestionPart2[];
  part3s: QuestionPart3[];
  part4s: QuestionPart4[];
  part5s: QuestionPart5[];
  part6s: QuestionPart6[];
  part7s: QuestionPart7[];
  audioFile?: string; // Add audioFile property
  title: string;
  id: string;
  };
}) => {
  
  const [timeRemaining, setTimeRemaining] = useState(timeLimit * 60);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: string]: string | null;
  }>({});
  const [listeningScore, setListeningScore] = useState(0);
  const [readingScore, setReadingScore] = useState(0);

  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [skippedAnswersCount, setSkippedAnswersCount] = useState(0);
  const [wrongAnswersCount, setWrongAnswersCount] = useState(0);
  const [timeTaken, setTimeTaken] = useState(0);
  const router = useRouter();
  const listeningParts = [1, 2, 3, 4]; // Listening parts
  const readingParts = [5, 6, 7]; // Reading parts
  const [currentPart, setCurrentPart] = useState(0);
  
  const questionsPerPart = [6, 25, 39, 30, 30, 16, 54];
  const [userId, setUserId] = useState<string>(''); // Giá trị ban đầu là chuỗi rỗng
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/user");
        if (!response.ok) {
          throw new Error("Failed to fetch user");
        }
        const data = await response.json();
        console.log("Fetched user data:", data); // In dữ liệu ra console để kiểm tra
        setUserId(data.userId); // Lưu userId vào state
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
  
    fetchUser();
  }, []);

  

  const selectedQuestions = selectedParts.reduce<Question[]>((acc, part) => {
    let questions: Question[] = [];

    switch (part) {
      case 1:
        questions = exam.part1s as QuestionPart1[];
        break;
      case 2:
        questions = exam.part2s as QuestionPart2[];
        break;
      case 3:
        questions = exam.part3s as QuestionPart3[];
        break;
      case 4:
        questions = exam.part4s as QuestionPart4[];
        break;
      case 5:
        questions = exam.part5s as QuestionPart5[];
        break;
      case 6:
        questions = exam.part6s as QuestionPart6[];
        break;
      case 7:
        questions = exam.part7s as QuestionPart7[];
        break;
      default:
        break;
    }

    return acc.concat(questions || []);
  }, []);

  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // Kiểm tra vị trí cuộn của người dùng
      if (window.pageYOffset === 0) {
        setIsAtTop(true); // Ở đầu trang
      } else {
        setIsAtTop(false); // Đã cuộn xuống
      }
    };

    // Lắng nghe sự kiện cuộn
    window.addEventListener("scroll", handleScroll);

    // Dọn dẹp sự kiện khi component bị huỷ
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const partForQuestion = (question: Question): number => {
    if (exam.part1s.includes(question as QuestionPart1)) return 1;
    if (exam.part2s.includes(question as QuestionPart2)) return 2;
    if (exam.part3s.includes(question as QuestionPart3)) return 3;
    if (exam.part4s.includes(question as QuestionPart4)) return 4;
    if (exam.part5s.includes(question as QuestionPart5)) return 5;
    if (exam.part6s.includes(question as QuestionPart6)) return 6;
    if (exam.part7s.includes(question as QuestionPart7)) return 7;
    return 0;
  };

  

// Tính toán các câu hỏi thuộc phần hiện tại
const startIndex = selectedParts
  .slice(0, currentPart) // Lấy các phần đã chọn cho đến phần hiện tại
  .reduce((acc, curr) => acc + questionsPerPart[curr - 1], 0); // curr - 1 vì selectedParts bắt đầu từ 1

const count = questionsPerPart[selectedParts[currentPart] - 1]; // Lấy số lượng câu hỏi cho phần hiện tại

// Lấy câu hỏi cho phần hiện tại
const partQuestions = selectedQuestions.slice(startIndex, startIndex + count);



  const handleSubmit = async () => {
    let totalListeningScore = 0;
    let totalReadingScore = 0;
    let correctCount = 0;
    let skippedCount = 0;
    let wrongCount = 0;
    setTimeTaken(timeLimit * 60 - timeRemaining);
    // Tạo một đối tượng UserAnswer để lưu thông tin
    const userAnswerData: UserAnswer = {
      userId: userId, // Thêm userId vào đây
      examId: exam.id, // Id của bài thi hiện tại
      scoreListening: totalListeningScore,
      scoreReading: totalReadingScore,
      totalScore: totalListeningScore + totalReadingScore,
      numberCorrect: correctCount,
      numberWrong: wrongCount,
      numberSkip: skippedCount,
      createdAt: new Date(),
      updatedAt: new Date(),
      userAnswerDetail: [],
      id: ""
    };
  
    // Tính toán câu trả lời của người dùng
    selectedQuestions.forEach((question) => {
      const selectedAnswer = selectedAnswers[question.id] || "";
      const isCorrect = selectedAnswer === question.correctAnswer;
  
      // Cập nhật số lượng đúng, sai và bỏ qua
      if (isCorrect) {
        correctCount += 1;
  
        // Tính điểm cho phần nghe và đọc
        if (listeningParts.includes(partForQuestion(question))) {
          totalListeningScore += 5; // Điểm phần nghe
        } else if (readingParts.includes(partForQuestion(question))) {
          totalReadingScore += 5; // Điểm phần đọc
        }
      } else if (!selectedAnswer) {
        skippedCount += 1;
      } else {
        wrongCount += 1;
      }
  
      // Thêm thông tin chi tiết câu trả lời
      userAnswerData.userAnswerDetail.push({
        questionId: question.id,
        selectedAnswer: selectedAnswer,
        isCorrect: isCorrect,
        isSkipped: !selectedAnswer,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });
  
    // Cập nhật điểm số tổng
    userAnswerData.scoreListening = totalListeningScore;
    userAnswerData.scoreReading = totalReadingScore;
    userAnswerData.totalScore = totalListeningScore + totalReadingScore;
    userAnswerData.numberCorrect = correctCount;
    userAnswerData.numberWrong = wrongCount;
    userAnswerData.numberSkip = skippedCount;

  
    // Lưu kết quả thi vào cơ sở dữ liệu
    try {
      await fetch("/api/examResults", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          examId: exam.id,
          scoreListening: totalListeningScore,
          scoreReading: totalReadingScore,
          totalScore: totalListeningScore + totalReadingScore,
          numberCorrect: correctCount,
          numberWrong: wrongCount,
          numberSkip: skippedCount,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      });

    
      // Lưu từng UserAnswer chi tiết
    const userAnswerResponse = await fetch("/api/userAnswers", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({
          ...userAnswerData, // Kết hợp dữ liệu userAnswerData
          userId: userId, // Thêm userId vào đây
      }),
  });

  const userAnswer = await userAnswerResponse.json(); // Giả sử trả về thông tin UserAnswer, bao gồm ID

  // Chuyển hướng đến trang UserAnswer chi tiết
  if (userAnswer.id) {
      router.push(`/userAnswer/${userAnswer.id}`);
  }

    // Cập nhật trạng thái với số lượng câu trả lời
    setCorrectAnswersCount(correctCount);
    setSkippedAnswersCount(skippedCount);
    setWrongAnswersCount(wrongCount);
    setListeningScore(totalListeningScore);
    setReadingScore(totalReadingScore);
    
  }catch (error) {
    console.error("Error fetching user data:", error);
  }


    
  };
  

  
  return (
    <div className="flex">
      <div className="w-4/5 p-4 bg-white rounded-lg">
        <div className="mb-4">
          {selectedParts.map((part, index) => (
            <button
              key={index}
              className={`mr-2 p-2 rounded ${currentPart === index ? "bg-blue-500 text-white" : "bg-gray-300"}`}
              onClick={() => setCurrentPart(index)}
            >
              Part {part}
            </button>
          ))}
        </div>
          
        {partQuestions.length === 0 ? (
  <p>Không có câu hỏi nào được chọn.</p>
) : (
  (() => {
    const groupedQuestions: { [key: string]: any[] } = {};

    // Organize questions by groupId
    partQuestions.forEach((question) => {
      const groupId = question.groupId || "ungrouped"; // Use "ungrouped" for questions without a groupId

      if (!groupedQuestions[groupId]) {
        groupedQuestions[groupId] = [];
      }
      groupedQuestions[groupId].push(question);
    });

    const groupIds = Object.keys(groupedQuestions);

    let overallIndex = startIndex; // Start from the overall start index

    return groupIds.map((groupId) => {
      const questionsInGroup = groupedQuestions[groupId];

      // Check if it's an ungrouped question or a group
      if (groupId === "ungrouped") {
        // Render ungrouped questions individually
        return questionsInGroup.map((question) => {
          const currentIndex = overallIndex++; // Use and increment the overall index
          const images = [
            question.imageFile,
            question.imageFile2,
            question.imageFile3,
          ].filter(Boolean);

          return (
            <div key={question.id} className="mb-4">
              {images.length > 0 && (
                <div
                  className="flex-shrink-0 overflow-y-auto space-y-2 mb-2"
                  style={{ maxHeight: '500px' }} // Set max height for scrolling
                >
                  {images.map((imageFile: string, index: number) => (
                    <img
                      key={index}
                      src={imageFile}
                      alt={`Hình ảnh ${index + 1}`}
                      className="mb-2 rounded"
                      style={{ width: '500px', height: 'auto' }}
                    />
                  ))}
                </div>
              )}
              
              <strong>Câu hỏi {currentIndex + 1}</strong>
              {question.audioFile && (
                <audio controls className="my-2">
                  <source src={question.audioFile} type="audio/mpeg" />
                  Trình duyệt của bạn không hỗ trợ phát âm thanh.
                </audio>
              )}
              <h3 className="font-semibold overflow-y-auto max-h-24 p-2 bg-white rounded" style={{ lineHeight: '2' }}>
                {question.questionText || ""}
              </h3>
              

              {["answer1", "answer2", "answer3", "answer4"].map((answerKey) => {
                const answer = (question as any)[answerKey];
                return answer ? (
                  <label className="block" key={answerKey}>
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      checked={selectedAnswers[question.id] === answer}
                      onChange={() =>
                        setSelectedAnswers((prev) => ({
                          ...prev,
                          [question.id]: answer,
                        }))
                      }
                    />
                    {answer}
                  </label>
                ) : null;
              })}
            </div>
          );
        });
      } else {
        // Render grouped questions in a single box
        const images = [
          questionsInGroup[0]?.imageFile,
          questionsInGroup[0]?.imageFile2,
          questionsInGroup[0]?.imageFile3,
        ].filter(Boolean);

        return (
          <div key={groupId} className="mb-4">
            <div className="flex my-4 bg-gray-100 border p-2 rounded">
              {images.length > 0 && (
                <div
                  className="flex-shrink-0 overflow-y-auto space-y-2"
                  style={{ maxHeight: '400px' }} // Set max height for scrolling
                >
                  {images.map((imageFile: string, index: number) => (
                    <img
                      key={index}
                      src={imageFile}
                      alt={`Hình ảnh ${index + 1} của nhóm câu hỏi ${groupId}`}
                      className="mb-2 rounded"
                      style={{ width: '500px', height: 'auto' }}
                    />
                  ))}
                </div>
              )}
              
              <div className="flex-grow overflow-y-auto max-h-60 ml-4">
                {questionsInGroup.map((question) => {
                  const currentIndex = overallIndex++; // Use and increment the overall index

                  return (
                    <div key={question.id} className="my-2">
                      <div className="mt-2">
                        <strong>Câu hỏi {currentIndex + 1}</strong>
                      </div>
                      <h3 className="font-semibold overflow-y-auto max-h-24 p-2 bg-white rounded" style={{ lineHeight: '1.5' }}>
                        {question.questionText || ""}
                      </h3>
                      {question.audioFile && (
                <audio controls className="my-2">
                  <source src={question.audioFile} type="audio/mpeg" />
                  Trình duyệt của bạn không hỗ trợ phát âm thanh.
                </audio>
              )}

                      {["answer1", "answer2", "answer3", "answer4"].map((answerKey) => {
                        const answer = (question as any)[answerKey];
                        return answer ? (
                          <label className="block" key={answerKey}>
                            <input
                              type="radio"
                              name={`question-${question.id}`}
                              checked={selectedAnswers[question.id] === answer}
                              onChange={() =>
                                setSelectedAnswers((prev) => ({
                                  ...prev,
                                  [question.id]: answer,
                                }))
                              }
                            />
                            {answer}
                          </label>
                        ) : null;
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      }
    });
  })()
)}


        {/* Nút Trang Tiếp Theo */}
        {selectedParts.length > 0 && currentPart < selectedParts.length && (
          <button
            onClick={() => {
              if (currentPart < selectedParts.length - 1) {
                // Nếu không phải là phần cuối cùng, chuyển sang phần tiếp theo
                setCurrentPart((prev) => prev + 1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              } else {
                // Nếu đang ở phần cuối cùng, thực hiện hành động nộp bài
                handleSubmit(); // Gọi hàm nộp bài
              }
            }}
            className="mt-4 bg-blue-500 text-white p-2 rounded"
          >
            {currentPart === selectedParts.length - 1
              ? "Nộp Bài"
              : "Trang Tiếp Theo"}
          </button>
        )}
      </div>
      <div className="w-1/5 p-4 bg-gray-100 rounded-lg ml-4 mt-8 mb-9">
        {/* Thay đổi từ w-1/3 thành w-1/5 */}
        <h2 className="text-lg font-bold">Thời gian còn lại</h2>
        <p>
          {Math.floor(timeRemaining / 60)} phút {timeRemaining % 60} giây
        </p>

        <h3 className="mt-4 font-bold">Trạng thái câu hỏi đã chọn:</h3>

        {selectedParts.map((part, index) => {
  // Calculate start index by summing up only selected parts' question counts before this part
  const startIndex = selectedParts
    .slice(0, index)
    .reduce((acc, currPart) => acc + questionsPerPart[currPart - 1], 0);

  // Get the count for the current part
  const count = questionsPerPart[part - 1];
  const partQuestions = selectedQuestions.slice(
    startIndex,
    startIndex + count
  );

  return (
    <div key={part} className="mt-2">
      <h4 className="font-semibold">Part {part}</h4>
      <div className="flex flex-wrap">
        {partQuestions.map((question, i) => (
          <div
            key={question.id}
            className={`w-6 h-6 rounded-full mr-2 mb-2 ${
              selectedAnswers[question.id] ? "bg-blue-500" : "bg-gray-300"
            }`}
            onClick={() => {
              setCurrentPart(part - 1); // Navigate to the corresponding part
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            style={{ cursor: "pointer" }}
          >
            <span className="text-white text-xs flex justify-center items-center h-full">
              {startIndex + i + 1}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
})}



        <button
          onClick={handleSubmit}
          className="mt-4 p-2 bg-blue-500 text-white rounded"
        >
          Nộp Bài
        </button>
      </div>

      <div className="fixed bottom-10 right-10 flex flex-col items-center">
        {/* DictionaryPopup luôn hiển thị */}
        <div className="mb-2">
          <DictionaryPopup />
        </div>

        {/* Nút cuộn lên chỉ hiển thị khi người dùng không ở đầu trang */}
        {!isAtTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="p-4 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition duration-300"
          >
            <FaArrowUp className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
};

export default PartialTestComponent;
