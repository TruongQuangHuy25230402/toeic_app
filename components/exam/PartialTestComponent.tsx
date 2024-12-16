import React, { useEffect, useState } from "react";
import Result from "./Result";
import DictionaryPopup from "./dictionary";
import { FaArrowDown, FaArrowUp, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  Exam,
  Grammar,
  QuestionPart1,
  QuestionPart2,
  QuestionPart3,
  QuestionPart4,
  QuestionPart5,
  QuestionPart6,
  QuestionPart7,
  Vocabulary,
} from "@prisma/client";
import { useRouter } from "next/navigation";
import HighlightableText from "../HighlightableAnswer";
import { Button } from "../ui/button";
import { useLocation } from "react-router-dom";
import useBeforeUnload from "../useBeforeUnload";
import useBackNavigation from "../useBackNavigation";
import usePreventNavigation from "../usePreventNavigation";


type Question =
  | QuestionPart1
  | QuestionPart2
  | QuestionPart3
  | QuestionPart4
  | QuestionPart5
  | QuestionPart6
  | QuestionPart7;

  interface User {
    id :         string;       
    username :   string;
    email:       string ;      
    profilePic:  string;
    clerkUserId: string ;      
    
  
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

  const questionsPerPart = [6, 25, 39, 30, 30, 16, 54];

function getSequentialQuestions(questions: Question[], count: number): Question[] {
  // Group câu hỏi theo groupId
  const groupedQuestions = questions.reduce<{ [key: string]: Question[] }>((acc, question) => {
    const groupId = question.groupId || 'no-group'; // Nếu không có groupId, gán vào group 'no-group'
    if (!acc[groupId]) {
      acc[groupId] = [];
    }
    acc[groupId].push(question);
    return acc;
  }, {});

  // Lấy các nhóm câu hỏi theo thứ tự
  const groupIds = Object.keys(groupedQuestions); // Không xáo trộn
  const selectedQuestions: Question[] = [];
  let questionsRemaining = count;

  for (const groupId of groupIds) {
    if (questionsRemaining <= 0) break; // Nếu đã chọn đủ số câu hỏi, dừng lại
    const group = groupedQuestions[groupId];
    const groupSize = group.length;

    if (groupSize <= questionsRemaining) {
      selectedQuestions.push(...group); // Chọn tất cả câu hỏi trong nhóm
      questionsRemaining -= groupSize;
    } else {
      // Nếu nhóm có nhiều hơn câu hỏi cần thiết, chỉ chọn số câu hỏi còn lại
      const selectedFromGroup = group.slice(0, questionsRemaining);
      selectedQuestions.push(...selectedFromGroup);
      questionsRemaining = 0; // Chọn đủ câu hỏi, dừng lại
    }
  }

  return selectedQuestions;
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
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [skippedAnswersCount, setSkippedAnswersCount] = useState(0);
  const [wrongAnswersCount, setWrongAnswersCount] = useState(0);
  const [timeTaken, setTimeTaken] = useState(0);
  const router = useRouter();
  const listeningParts = [1, 2, 3, 4]; // Listening parts
  const readingParts = [5, 6, 7]; // Reading parts
  const [currentPart, setCurrentPart] = useState(0);
  const [isExamOngoing, setIsExamOngoing] = useState(true); // Trạng thái làm bài thi
  



  const [userId, setUserId] = useState<string>(''); // Giá trị ban đầu là chuỗi rỗng


  // Hook chặn reload hoặc thoát trang
  useBeforeUnload(isExamOngoing);
  useBackNavigation(isExamOngoing);
  usePreventNavigation(isExamOngoing && timeRemaining > 0);
  
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




  useEffect(() => {
    // Hàm để chọn câu hỏi theo thứ tự cho tất cả các phần đã chọn
    const sequentialQuestions = selectedParts.reduce<Question[]>((acc, part) => {
      let questions: Question[] = [];
  
      // Lấy câu hỏi tương ứng với phần
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
  
      // Lấy số lượng câu hỏi cần chọn cho phần hiện tại từ mảng `questionsPerPart`
      const numberOfQuestionsToSelect = questionsPerPart[part - 1]; // `part - 1` vì mảng bắt đầu từ 0
  
      // Lấy câu hỏi tuần tự
      const selected = questions.slice(0, numberOfQuestionsToSelect);
  
      return acc.concat(selected);
    }, []);
  
    // Cập nhật trạng thái với câu hỏi đã chọn
    setSelectedQuestions(sequentialQuestions);
  
  }, [selectedParts, exam]); // Chỉ gọi khi `selectedParts` hoặc `exam` thay đổi
  
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

  

  // Tính toán chỉ mục và số lượng câu hỏi cho phần thi hiện tại
const startIndex = selectedParts
.slice(0, currentPart) // Lấy các phần đã chọn cho đến phần hiện tại
.reduce((acc, curr) => acc + questionsPerPart[curr - 1], 0); // Sử dụng mảng questionsPerPart

const count = questionsPerPart[selectedParts[currentPart] - 1]; // Lấy số lượng câu hỏi cho phần hiện tại

// Lấy câu hỏi cho phần hiện tại
const partQuestions = selectedQuestions.slice(startIndex, startIndex + count);

  // Track visibility of explanations for each question
  const [visibleExplanations, setVisibleExplanations] = useState<{ [key: string]: boolean }>({});

  const toggleExplanation = (questionId: string) => {
    setVisibleExplanations((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };



  const handleSubmit = async () => {

    // Hiển thị thông báo xác nhận
  const isConfirmed = window.confirm("Bạn có chắc chắn muốn nộp bài?");
  
  // Nếu người dùng không đồng ý, thoát khỏi hàm
  if (!isConfirmed) {
    return;
  }
  
    let totalListeningScore = 0;
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
    <div className="flex">
      <div className="w-full md:w-4/5 p-4 bg-white rounded-lg">
      <div className="mb-4 flex flex-wrap gap-2">
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
  <p className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg shadow-md text-blue-900">
    {question.explainAnswer}
  </p>
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
<p className="text-2xl font-bold text-red-600 bg-yellow-100 p-2 rounded">
  {Math.floor(timeRemaining / 60)} phút {timeRemaining % 60} giây
</p>


        <h3 className="mt-4 font-bold">Trạng thái câu hỏi đã chọn:</h3>

        {selectedParts.map((part, index) => {
  // Tính toán chỉ mục bắt đầu cho phần hiện tại
  const startIndex = selectedParts
    .slice(0, index) // Lấy các phần đã chọn trước phần hiện tại
    .reduce((acc, currPart) => {
      return acc + questionsPerPart[currPart - 1]; // Sử dụng mảng questionsPerPart (currPart - 1 là vì chỉ mục mảng bắt đầu từ 0)
    }, 0);

  // Lấy số câu hỏi cho phần hiện tại
  const count = questionsPerPart[part - 1]; // Sử dụng mảng questionsPerPart

  // Lấy câu hỏi cho phần hiện tại từ selectedQuestions
  const partQuestions = selectedQuestions.slice(startIndex, startIndex + count);

  return (
    <div key={part} className="mt-2">
      <h4 className="font-semibold">Part {part}</h4>
      <div className="flex flex-wrap">
        {partQuestions.map((question, i) => (
          <div
            key={question.id}
            className={`w-6 h-6 rounded-full mr-2 mb-2 ${selectedAnswers[question.id] ? "bg-blue-500" : "bg-gray-300"}`}
            onClick={() => {
              setCurrentPart(part - 1); // Chuyển đến phần tương ứng
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
          <Button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="p-4 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition duration-300"
          >
            <FaArrowUp className="w-6 h-6" />
          </Button>
        )}
      </div>
      
    </div>
  );
};

export default PartialTestComponent;
