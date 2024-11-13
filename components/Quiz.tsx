"use client";
import { useState, useEffect } from "react";
import StatCard from "./StatCard";

interface QuizProps {
  questions: {
    question: string;
    answers: string[];
    correctAnswer: string;
  }[];
  userId: string | undefined;
}

const Quiz = ({ questions, userId }: QuizProps) => {
  const [activeQuestion, setActiveQuestion] = useState(0); // câu hỏi hiện tại
  const [selectedAnswer, setSelectedAnswer] = useState(""); // câu trả lời đã chọn
  const [checked, setChecked] = useState(false); // kiểm tra xem user chọn chưa
  const [selectedAnswerIndex, setSelectedAnswerIndex] =
    useState<number | null>(null); // mục của câu trả lời đã chọn
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState({
    score: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
  }); // hiển thị kết quả
  const [timeRemaining, setTimeRemaining] = useState(25); // thời gian trả lời câu hỏi
  const [timerRunning, setTimerRunning] = useState(false); // xác định bố đếm chạy

  console.log("questions", questions)

  const { question, answers, correctAnswer } =
    questions[activeQuestion];// Lấy câu hỏi, câu trả lời, từ câu hỏi hiện tại

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timerRunning && timeRemaining > 0) {
      timer = setTimeout(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      handleTimeUp();
    }
    return () => clearTimeout(timer);
  }, [timerRunning, timeRemaining]); // Hook useEffect quản lý bộ đếm thời gian

  const startTimer = () => {
    setTimerRunning(true);
  };

  const stopTimer = () => {
    setTimerRunning(false);
  };

  const resetTimer = () => {
    setTimeRemaining(25);
  };

  const handleTimeUp = () => {
    stopTimer();
    resetTimer();
    nextQuestion();
  };

  useEffect(() => {
    startTimer();

    return () => {
      stopTimer();
    };
  }, []);

  const onAnswerSelected = (
    answer: string,
    idx: number
  ) => {
    setChecked(true);
    setSelectedAnswerIndex(idx);
    if (answer === correctAnswer) {
      setSelectedAnswer(answer);
    } else {
      setSelectedAnswer("");
    }
  }; // Sau khi người dùng chọn đáp án, nếu đúng => lưu lại, còn k đặt là selectAnsw

  const nextQuestion = () => {
    setSelectedAnswerIndex(null);
    setResults((prev) =>
      selectedAnswer
        ? {
            ...prev,
            score: prev.score + 5,
            correctAnswers: prev.correctAnswers + 1,
          }
        : {
            ...prev,
            wrongAnswers: prev.wrongAnswers + 1,
          }
    );
    if (activeQuestion !== questions.length - 1) {
      setActiveQuestion((prev) => prev + 1);
    } else {
      setShowResults(true);
      stopTimer();
      fetch("/api/quizResults", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          quizScore: results.score,
          correctAnswers: results.correctAnswers,
          wrongAnswers: results.wrongAnswers,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              "Network response was not working fam"
            );
          }
          return response.json();
        })
        .then((data) => {
          console.log(
            "Quiz results saved successfully:",
            data
          );
        })
        .catch((error) => {
          console.error(
            "Error saving quiz results:",
            error
          );
        });
    }
    setChecked(false);
    resetTimer();
    startTimer();
  }; // Chuyển sang câu hỏi tiếp theo, cập nhật điểm, số câu trả lời, nếu là câu cuối thì trả kết quả
  return (
    <div className="min-h-[500px]">
      <div className="max-w-[1500px] mx-auto w-[90%] flex justify-center py-10 flex-col">
        {!showResults ? (
          <>
            <div className="flex justify-between mb-10 items-center">
              <div className="bg-primary text-white px-4 rounded-md py-1">
                <h2>
                  Question: {activeQuestion + 1}
                  <span>/{questions.length}</span>
                </h2>
              </div>

              <div className="bg-primary text-white px-4 rounded-md py-1">
                {timeRemaining} seconds to answer
              </div>
            </div>

            <div>
              <h3 className="mb-5 text-2xl font-bold">
                {question}
              </h3>
              <ul>
                {answers.map(
                  (answer: string, idx: number) => (
                    <li
                      key={idx}
                      onClick={() =>
                        onAnswerSelected(answer, idx)
                      }
                      className={`cursor-pointer mb-5 py-3 rounded-md hover:bg-primary hover:text-white px-3
                      ${
                        selectedAnswerIndex === idx &&
                        "bg-primary text-white"
                      }
                      `}
                    >
                      <span>{answer}</span>
                    </li>
                  )
                )}
              </ul>
              <button
                onClick={nextQuestion}
                disabled={!checked}
                className="font-bold"
              >
                {activeQuestion === questions.length - 1
                  ? "Finish"
                  : "Next Question →"}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <h3 className="text-2xl uppercase mb-10">
              Results 📈
            </h3>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-10">
              <StatCard
                title="Percentage"
                value={`${(results.score / 50) * 100}%`}
              />
              <StatCard
                title="Total Questions"
                value={questions.length}
              />
              <StatCard
                title=" Total Score"
                value={results.score}
              />
              <StatCard
                title="Correct Answers"
                value={results.correctAnswers}
              />
              <StatCard
                title="Wrong Answers"
                value={results.wrongAnswers}
              />
            </div>
            <button
              onClick={() => window.location.reload()}
              className="mt-10 font-bold uppercase"
            >
              Restart Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  ); // Phần trả về của component, hiển thị câu hỏi, thời gian, các lựa chọn 
};

export default Quiz;