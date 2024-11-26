"use client"

import React, { useState, useEffect } from "react";
import {
  QuestionPart1,
  QuestionPart2,
  QuestionPart3,
  QuestionPart4,
  QuestionPart5,
  QuestionPart6,
  QuestionPart7,
  User,
} from "@prisma/client";
import DictionaryPopup from "./dictionary";
import { FaArrowUp } from "react-icons/fa";
import { useRouter } from "next/navigation";



type Question =
  | QuestionPart1
  | QuestionPart2
  | QuestionPart3
  | QuestionPart4
  | QuestionPart5
  | QuestionPart6
  | QuestionPart7;


// Define the structure of the exam prop you expect
interface ExamProps {
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
}

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
  timeTaken: string;
  createdAt: Date;
  updatedAt: Date;
  userAnswerDetail: UserAnswerDetail[]; // Đảm bảo có thuộc tính này
}


const getRandomSubset = <T,>(array: T[], count: number): T[] => {
  const shuffled = [...array].sort(() => Math.random() - 0.5); // Xáo trộn
  return shuffled.slice(0, count); // Lấy `count` phần tử
};


const FullTestComponent = ({ exam }: { exam: ExamProps }) => {
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: string]: string | null;
  }>({});
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [listeningScore, setListeningScore] = useState(0);
  const [readingScore, setReadingScore] = useState(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [skippedAnswersCount, setSkippedAnswersCount] = useState(0);
  const [wrongAnswersCount, setWrongAnswersCount] = useState(0);
  const [timeTaken, setTimeTaken] = useState(0);
  const [currentPart, setCurrentPart] = useState(0);
  const [isAtTop, setIsAtTop] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(120 * 60); // Thời gian mặc định là 120 phút (120 * 60 giây)
  const router = useRouter();

  const listeningParts = [1, 2, 3, 4]; // Listening parts
  const readingParts = [5, 6, 7]; // Reading parts
  const questionsPerPart = [6, 25, 39, 30, 30, 16, 54];
  const [userId, setUserId] = useState<string>(''); // Giá trị ban đầu là chuỗi rỗng
 

  

  
  // ...
 
  

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
  
  

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(countdown); // Dừng đếm ngược khi thời gian còn lại là 0
          handleSubmit(); // Gọi hàm nộp bài khi hết thời gian
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000); // Cập nhật mỗi giây

    return () => clearInterval(countdown); // Xóa interval khi component bị unmount
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
  

 // Hàm random câu hỏi cho mỗi phần dựa trên số lượng yêu cầu
 useEffect(() => {
  // Random câu hỏi một lần duy nhất khi component được mount
  const randomQuestions = [
    ...getRandomSubset(exam.part1s, 6),
    ...getRandomSubset(exam.part2s, 25),
    ...getRandomSubset(exam.part3s, 39),
    ...getRandomSubset(exam.part4s, 30),
    ...getRandomSubset(exam.part5s, 30),
    ...getRandomSubset(exam.part6s, 16),
    ...getRandomSubset(exam.part7s, 54),
  ];

  setSelectedQuestions(randomQuestions);
}, [exam]);



  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.pageYOffset === 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPart]);

  // ...


  const startIndex =
    currentPart > 0
      ? questionsPerPart
          .slice(0, currentPart)
          .reduce((acc, curr) => acc + curr, 0)
      : 0; // Tính chỉ số bắt đầu cho phần hiện tại

  const count = questionsPerPart[currentPart]; // Lấy số lượng câu hỏi cho phần hiện tại

  // Lấy câu hỏi cho phần hiện tại
  const partQuestions = selectedQuestions.slice(startIndex, startIndex + count);

  const [visibleExplanations, setVisibleExplanations] = useState<{ [key: string]: boolean }>({});

  const toggleExplanation = (questionId: string) => {
    setVisibleExplanations((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

 const handleSubmit = async () => {
    let totalListeningScore =0;
    let totalReadingScore = 0;
    let correctCount = 0;
    let skippedCount = 0;
    let wrongCount = 0;
  
    // Tính thời gian đã sử dụng
    const timeTakenSeconds = 120 * 60 - timeRemaining;

// Hàm chuyển đổi giây sang định dạng HH:mm:ss
const formatTime = (seconds: number): string => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Định dạng timeTaken
const formattedTimeTaken = formatTime(timeTakenSeconds);
  
     // Lấy userId từ local storage
  

  // Kiểm tra userId
  

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
      timeTaken: formattedTimeTaken, // Thêm timeTaken vào đây
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
    <div className="flex flex-col items-center mb-6">
       <h1 className="text-2xl font-bold mb-4">Bài thi: {exam.title}</h1>
       

       {exam.audioFile && (
    <audio controls className="w-full max-w-lg mb-4">
      <source src={exam.audioFile} type="audio/mpeg" />
      Your browser does not support the audio tag.
    </audio>
  )}
      <div className="flex">
      <div className="w-full md:w-4/5 p-4 bg-white rounded-lg">
      <div className="mb-4 flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5, 6, 7].map((part, index) => (
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
            const groupId = question.groupId || 'ungrouped';
            if (!groupedQuestions[groupId]) {
              groupedQuestions[groupId] = [];
            }
            groupedQuestions[groupId].push(question);
          });

          const groupIds = Object.keys(groupedQuestions);
          let overallIndex = startIndex;

          return groupIds.map((groupId) => {
            const questionsInGroup = groupedQuestions[groupId];
            if (groupId === 'ungrouped') {
              return questionsInGroup.map((question) => {
                const currentIndex = overallIndex++;
                const images = [question.imageFile, question.imageFile2, question.imageFile3].filter(Boolean);

                return (
                  <div key={question.id} className="mb-4">
                    {images.length > 0 && (
                      <div className="flex-shrink-0 overflow-y-auto space-y-2 mb-2" style={{ maxHeight: '500px' }}>
                        {images.map((imageFile: string, index: number) => (
                          <img key={index} src={imageFile} alt={`Hình ảnh ${index + 1}`} className="mb-2 rounded" style={{ width: '500px', height: 'auto' }} />
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
                      {question.questionText || ''}
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

                    {/* Toggle explanation button */}
                    <button onClick={() => toggleExplanation(question.id)} className="mt-2 text-blue-500">
                      {visibleExplanations[question.id] ? 'Ẩn transcript' : 'Hiện transcript'}
                    </button>

                    {/* Explanation display */}
                    {visibleExplanations[question.id] && (
                      <p className="mt-2 p-2 bg-gray-100 rounded">{question.explainAnswer}</p>
                    )}
                  </div>
                );
              });
            } else {
              const images = [
                questionsInGroup[0]?.imageFile,
                questionsInGroup[0]?.imageFile2,
                questionsInGroup[0]?.imageFile3,
              ].filter(Boolean);

              return (
                <div key={groupId} className="mb-4">
                  <div className="flex my-4 bg-gray-100 border p-2 rounded">
                    {images.length > 0 && (
                      <div className="flex-shrink-0 overflow-y-auto space-y-2" style={{ maxHeight: '400px' }}>
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
                        const currentIndex = overallIndex++;

                        return (
                          <div key={question.id} className="my-2">
                            <div className="mt-2">
                              <strong>Câu hỏi {currentIndex + 1}</strong>
                            </div>
                            <h3 className="font-semibold overflow-y-auto max-h-24 p-2 bg-white rounded" style={{ lineHeight: '1.5' }}>
                              {question.questionText || ''}
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

                            {/* Toggle explanation button */}
                            <button onClick={() => toggleExplanation(question.id)} className="mt-2 text-blue-500">
                              {visibleExplanations[question.id] ? 'Ẩn transcript' : 'Hiện transcript'}
                            </button>

                            {/* Explanation display */}
                            {visibleExplanations[question.id] && (
                              <p className="mt-2 p-2 bg-gray-100 rounded">{question.explainAnswer}</p>
                            )}
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

{[1, 2, 3, 4, 5, 6, 7].length > 0 && currentPart < [1, 2, 3, 4, 5, 6, 7].length && (
          <button
            onClick={() => {
              if (currentPart < [1, 2, 3, 4, 5, 6, 7].length - 1) {
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
            {currentPart === [1, 2, 3, 4, 5, 6, 7].length - 1
              ? "Nộp Bài"
              : "Trang Tiếp Theo"}
          </button>
        )}
        </div>

        {/* Phần thời gian còn lại và trạng thái câu hỏi đã chọn */}
        <div className="w-1/5 p-4 bg-gray-100 rounded-lg ml-4 mt-8 mb-9">
          <h2 className="text-lg font-bold">Thời gian còn lại</h2>
          <p>
            {Math.floor(timeRemaining / 60)} phút {timeRemaining % 60} giây
          </p>

          <h3 className="mt-4 font-bold">Trạng thái câu hỏi đã chọn:</h3>

          {[1, 2, 3, 4, 5, 6, 7].map((part) => {
            const count = questionsPerPart[part - 1]; // Số câu hỏi cho phần này
            const startIndex = questionsPerPart
              .slice(0, part - 1)
              .reduce((acc, curr) => acc + curr, 0); // Tính chỉ số bắt đầu cho phần
            const partQuestions = selectedQuestions.slice(
              startIndex,
              startIndex + count
            ); // Lấy câu hỏi cho phần hiện tại

            return (
              <div key={part} className="mt-2">
                <h4 className="font-semibold">Part {part}</h4>
                <div className="flex flex-wrap">
                  {partQuestions.map((question, index) => (
                    <div
                      key={question.id}
                      className={`w-6 h-6 rounded-full mr-2 mb-2 ${selectedAnswers[question.id] ? "bg-blue-500" : "bg-gray-300"}`}
                      onClick={() => {
                        setCurrentPart(part - 1); // Chuyển đến part tương ứng (bằng cách giảm 1 vì index bắt đầu từ 0)
                        window.scrollTo({ top: 0, behavior: "smooth" }); // Cuộn trang lên đầu
                      }}
                      style={{ cursor: "pointer" }} // Thêm cursor pointer để tạo cảm giác tương tác
                    >
                      <span className="text-white text-xs flex justify-center items-center h-full">
                        {startIndex + index + 1}
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
    <div className="max-h-48 overflow-y-auto z-20">
    <DictionaryPopup />
    </div>

    {/* Nút cuộn lên chỉ hiển thị khi người dùng không ở đầu trang */}
    {!isAtTop && (
      <div className="mt-2">
        <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="p-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition duration-300"
    >
      <FaArrowUp className="w-6 h-6" />
    </button>
      </div>
    )}
  </div>
      </div>
    </div>
  );
};

export default FullTestComponent;

