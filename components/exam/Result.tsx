import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import UserInfo from "../user/UserInfo";

const Result = ({
  score,
  correctCount,
  wrongCount,
  skippedCount,
  timeTaken,
  totalQuestions,
  listeningCorrect,
  listeningScore,
  readingCorrect,
  readingScore,
}: {
  score: number;
  correctCount: number;
  wrongCount: number;
  skippedCount: number;
  timeTaken: number;
  totalQuestions: number;
  listeningCorrect: number;
  listeningScore: number;
  readingCorrect: number;
  readingScore: number;
}) => {
  const timeInHours = Math.floor(timeTaken / 3600);
const timeInMinutes = Math.floor((timeTaken % 3600) / 60);
const timeInSeconds = timeTaken % 60;

const [selectedPart, setSelectedPart] = useState<number | null>(null);

  const handlePartClick = (part: number) => {
    setSelectedPart(selectedPart === part ? null : part);
  };

  

  return (
    <div className="flex">

      {/* 80% Right Panel */}
      <div className="w-4/5 flex flex-col">
  {/* Container for Result Header and Scores Section */}
  <div className="flex justify-between w-full">
    {/* Result Header (20% width) */}
    <div className="w-1/5 p-4 bg-white rounded-lg border-2 border-gray-300 mb-4">
      <h1 className="text-xl font-bold mb-4">Kết quả thi</h1>
      <p className="mt-4">
        Điểm của bạn: <strong>{score}</strong>
      </p>
      <p className="mt-2">
        Độ chính xác:{" "}
        <strong>{((correctCount / totalQuestions) * 100).toFixed(2)}%</strong> 
      </p>
      <p className="mt-2">
        Thời gian <br></br> hoàn thành:{" "}
        <strong>
         {timeInHours} : {timeInMinutes} : {timeInSeconds} 
        </strong>
      </p>
    </div>

    {/* Scores Section (80% width) */}
    <div className="w-4/5 mb-4">
      {/* Correct, Wrong, Skipped, and Total Score */}
      <div className="flex justify-between mb-4 ml-2">
        {/* Correct Answers */}
        <div className="p-4 bg-white border-2 border-gray-300 rounded-lg flex-1 mx-1">
          <h2 className="text-lg font-bold text-gray-700">Trả lời đúng</h2>
          <p className="mt-2 text-xl font-bold">{correctCount}</p>
        </div>

        {/* Wrong Answers */}
        <div className="p-4 bg-white border-2 border-gray-300 rounded-lg flex-1 mx-1">
          <h2 className="text-lg font-bold text-gray-700">Trả lời sai</h2>
          <p className="mt-2 text-xl font-bold">{wrongCount}</p>
        </div>

        {/* Skipped */}
        <div className="p-4 bg-white border-2 border-gray-300 rounded-lg flex-1 mx-1">
          <h2 className="text-lg font-bold text-gray-700">Bỏ qua</h2>
          <p className="mt-2 text-xl font-bold">{skippedCount}</p>
        </div>

        {/* Total Score */}
        <div className="p-4 bg-white border-2 border-gray-300 rounded-lg flex-1 mx-1">
          <h2 className="text-lg font-bold text-gray-700">Tổng điểm</h2>
          <p className="mt-2 text-xl font-bold">{score}</p>
        </div>
      </div>

      {/* Listening and Reading */}
      <div className="grid grid-cols-2 gap-4 ml-2">
        {/* Listening */}
        <div className="p-4 bg-white border-2 border-gray-300 rounded-lg">
          <h2 className="text-lg font-bold text-gray-700">Listening</h2>
          <p className="mt-2">
            Trả lời đúng: <strong>{listeningCorrect}</strong>
          </p>
          <p className="mt-2">
            Số điểm: <strong>{listeningScore}</strong>
          </p>
        </div>

        {/* Reading */}
        <div className="p-4 bg-white border-2 border-gray-300 rounded-lg">
          <h2 className="text-lg font-bold text-gray-700">Reading</h2>
          <p className="mt-2">
            Trả lời đúng: <strong>{readingCorrect}</strong>
          </p>
          <p className="mt-2">
            Số điểm: <strong>{readingScore}</strong>
          </p>
        </div>
      </div>
    </div>

    
    
  </div>

  {/* 20% Left Panel with UserInfo */}
</div>

      <div className="w-1/5 p-4  mr-4">
       
      </div>
    </div>
  );
};

export default Result;