
import { getUsersById } from "@/actions/getUsersById";
import UserAnswerT from "@/components/user-answers/UserAnswerT";

import UserInfo from "@/components/user/UserInfo";
import React from "react";

interface UserPageProps {
  params: {
    id: string;
    userId: string
  };
}

const UserAnswers = async ({ params }: UserPageProps) => {
  const userAnswer = await getUsersById(params.id);



  return (
    <div>
      {userAnswer ? (
        <div>
          <div className="flex">
            {/* 80% Right Panel */}
            <div className="w-4/5 flex flex-col">
              {/* Container for Result Header and Scores Section */}
              <div className="flex justify-between w-full">
                {/* Result Header */}
                <div className="w-1/5 p-4 bg-white rounded-lg border-2 border-gray-300 mb-4">
                  <h1 className="text-xl font-bold mb-4">Kết quả thi</h1>
                  <div>
                    <p className="mt-4">
                      Điểm của bạn: <strong>{userAnswer.totalScore}</strong>
                    </p>
                    <p className="mt-2">
                      Độ chính xác:{" "}
                      <strong>
                        {((userAnswer.numberCorrect / (userAnswer.numberCorrect + userAnswer.numberWrong + userAnswer.numberSkip)) * 100).toFixed(2)}%
                      </strong>
                    </p>
                    <p className="mt-2">
                      Thời gian hoàn thành: <strong>{userAnswer.timeTaken}</strong>
                    </p>
                  </div>
                </div>

                {/* Scores Section */}
                <div className="w-4/5 mb-4">
                  <div className="flex justify-between mb-4 ml-2">
                    {/* Correct, Wrong, Skipped, and Total Score */}
                    <div className="p-4 bg-white border-2 border-gray-300 rounded-lg flex-1 mx-1">
                      <h2 className="text-lg font-bold text-gray-700">Trả lời đúng</h2>
                      <p className="mt-2 text-xl font-bold">{userAnswer.numberCorrect}</p>
                    </div>
                    <div className="p-4 bg-white border-2 border-gray-300 rounded-lg flex-1 mx-1">
                      <h2 className="text-lg font-bold text-gray-700">Trả lời sai</h2>
                      <p className="mt-2 text-xl font-bold">{userAnswer.numberWrong}</p>
                    </div>
                    <div className="p-4 bg-white border-2 border-gray-300 rounded-lg flex-1 mx-1">
                      <h2 className="text-lg font-bold text-gray-700">Bỏ qua</h2>
                      <p className="mt-2 text-xl font-bold">{userAnswer.numberSkip}</p>
                    </div>
                    <div className="p-4 bg-white border-2 border-gray-300 rounded-lg flex-1 mx-1">
                      <h2 className="text-lg font-bold text-gray-700">Tổng điểm</h2>
                      <p className="mt-2 text-xl font-bold">{userAnswer.totalScore}</p>
                    </div>
                  </div>

                  {/* Listening and Reading */}
                  <div className="grid grid-cols-2 gap-4 ml-2">
                    <div className="p-4 bg-white border-2 border-gray-300 rounded-lg">
                      <h2 className="text-lg font-bold text-gray-700">Listening</h2>
                      <p className="mt-2">Số điểm: <strong>{userAnswer.scoreListening}</strong></p>
                    </div>
                    <div className="p-4 bg-white border-2 border-gray-300 rounded-lg">
                      <h2 className="text-lg font-bold text-gray-700">Reading</h2>
                      <p className="mt-2">Số điểm: <strong>{userAnswer.scoreReading}</strong></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 20% Left Panel with UserInfo */}
            <div className="w-1/5 p-4 mr-4">
              <UserInfo userId={userAnswer.userId}/>
            </div>
          </div>

          
          
        </div>
      ) : (
        <p>No data</p>
      )}
    </div>
  );
};

export default UserAnswers;
