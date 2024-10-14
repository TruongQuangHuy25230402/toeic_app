import React, { useEffect, useState } from "react";
import Result from "./Result";
import DictionaryPopup from "./dictionary";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import {
  UserAnswer,
  Exam,
  QuestionPart1,
  QuestionPart2,
  QuestionPart3,
  QuestionPart4,
  QuestionPart5,
  QuestionPart6,
  QuestionPart7,
  TopicPart1,
  TopicPart2,
  TopicPart3,
  TopicPart4,
  TopicPart5,
  TopicPart6,
  TopicPart7,
} from "@prisma/client";
import HighlightableText from "../HighlightableAnswer";

type Question =
  | QuestionPart1
  | QuestionPart2
  | QuestionPart3
  | QuestionPart4
  | QuestionPart5
  | QuestionPart6
  | QuestionPart7;

interface myResultProps {
  result: UserAnswer & {
    Exam: Exam | null;
    TopicPart1: TopicPart1 | null;
    TopicPart2: TopicPart2 | null;
    TopicPart3: TopicPart3 | null;
    TopicPart4: TopicPart4 | null;
    TopicPart5: TopicPart5 | null;
    TopicPart6: TopicPart6 | null;
    TopicPart7: TopicPart7 | null;
    QuestionPart1: QuestionPart1 | null;
    QuestionPart2: QuestionPart2 | null;
    QuestionPart3: QuestionPart3 | null;
    QuestionPart4: QuestionPart4 | null;
    QuestionPart5: QuestionPart5 | null;
    QuestionPart6: QuestionPart6 | null;
    QuestionPart7: QuestionPart7 | null;
  };
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

  const listeningParts = [1, 2, 3, 4]; // Listening parts
  const readingParts = [5, 6, 7]; // Reading parts
  const [currentPart, setCurrentPart] = useState(0);

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

  const handleSubmit = async () => {
    let totalListeningScore = 0;
    let totalReadingScore = 0;
    let correctCount = 0;
    let skippedCount = 0;
    let wrongCount = 0;
    setTimeTaken(timeLimit * 60 - timeRemaining);
  
    const userAnswers: UserAnswer[] = selectedQuestions.map((question) => {
      const selectedAnswer = selectedAnswers[question.id] || "";
      const isCorrect = selectedAnswer === question.correctAnswer;
  
      if (isCorrect) {
        correctCount += 1;
        if (listeningParts.includes(partForQuestion(question))) {
          totalListeningScore += 5; // Listening part score
        } else if (readingParts.includes(partForQuestion(question))) {
          totalReadingScore += 5; // Reading part score
        }
      } else if (!selectedAnswer) {
        skippedCount += 1;
      } else {
        wrongCount += 1;
      }
  
      let userAnswer: Partial<UserAnswer> = {
        selectedAnswer,
        isCorrect,
        isSkipped: !selectedAnswer,
      };
  
      if (exam.part1s.includes(question as QuestionPart1)) {
        userAnswer.part1sId = question.id;
      } else if (exam.part2s.includes(question as QuestionPart2)) {
        userAnswer.part2sId = question.id;
      } else if (exam.part3s.includes(question as QuestionPart3)) {
        userAnswer.part3sId = question.id;
      } else if (exam.part4s.includes(question as QuestionPart4)) {
        userAnswer.part4sId = question.id;
      } else if (exam.part5s.includes(question as QuestionPart5)) {
        userAnswer.part5sId = question.id;
      } else if (exam.part6s.includes(question as QuestionPart6)) {
        userAnswer.part6sId = question.id;
      } else if (exam.part7s.includes(question as QuestionPart7)) {
        userAnswer.part7sId = question.id;
      }
  
      return userAnswer as UserAnswer;
    });
  
    // Tính điểm tổng
    const score = totalListeningScore + totalReadingScore;
  
   // try {
     // await fetch("/api/userAnswers", {
       // method: "POST",
       // headers: {
       //   "Content-Type": "application/json",
      //  },
       // body: JSON.stringify({ userAnswers }),
      //});
    //} catch (error) {
    //  console.error("Error saving user answers:", error);
    //}
  
    setCorrectAnswersCount(correctCount);
    setSkippedAnswersCount(skippedCount);
    setWrongAnswersCount(wrongCount);
    setListeningScore(totalListeningScore);
    setReadingScore(totalReadingScore);
    setShowResult(true);
  };

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

  if (showResult) {
    return (
      <Result
        listeningScore={listeningScore}
        readingScore={readingScore}
        correctCount={correctAnswersCount}
        wrongCount={wrongAnswersCount}
        skippedCount={skippedAnswersCount}
        timeTaken={timeTaken}
        totalQuestions={selectedQuestions.length}
        score={listeningScore + readingScore} // Truyền điểm tổng
        listeningCorrect={0}
        readingCorrect={0}
      />
    );
  }

  const questionsPerPart = [6, 25, 39, 30, 30, 16, 54];

  // Tính toán các câu hỏi thuộc phần hiện tại
  // Tính toán chỉ số bắt đầu và số lượng câu hỏi cho phần hiện tại
  const startIndex = selectedParts
    .slice(0, currentPart) // Lấy các phần đã chọn cho đến phần hiện tại
    .reduce((acc, curr) => acc + questionsPerPart[curr - 1], 0); // curr - 1 vì selectedParts bắt đầu từ 1, nhưng questionsPerPart bắt đầu từ 0

  const count = questionsPerPart[selectedParts[currentPart] - 1]; // Lấy số lượng câu hỏi cho phần hiện tại

  // Lấy câu hỏi cho phần hiện tại
  const partQuestions = selectedQuestions.slice(startIndex, startIndex + count);

  
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
          partQuestions.map((question, index) => (
            <div
              key={question.id}
              className="my-4 bg-gray-100 border p-2 rounded"
            >
              <div className="mt-2">
                <strong>Câu hỏi {startIndex + index + 1}</strong>
              </div>
              <h3 className="font-semibold">
                {(question as any).questionText || ""}
              </h3>
              {"audioFile" in question && question.audioFile && (
                <audio controls>
                  <source src={question.audioFile} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              )}
              {"imageFile" in question && question.imageFile && (
                <img
                  src={question.imageFile}
                  alt={`Câu hỏi ${startIndex + index + 1}`}
                  className="mt-2 rounded"
                />
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
          ))
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

        {selectedParts.map((part) => {
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
