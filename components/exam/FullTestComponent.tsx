import React from 'react'

import { useState, useEffect } from 'react';

const FullTestComponent = () => {
  const numberOfQuestions = 10; // Số lượng câu hỏi giả lập
  const [timeLeft, setTimeLeft] = useState(120 * 60); // 120 phút đếm ngược (tính bằng giây)

  // Hàm để format thời gian từ giây thành mm:ss
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // useEffect để bắt đầu đếm ngược thời gian
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer); // Xóa bộ đếm khi component bị hủy
  }, []);

  const handleSubmit = () => {
    // Logic khi nộp bài, có thể điều hướng hoặc xác nhận nộp bài
    alert('Bài thi của bạn đã được nộp!');
  };

  return (
    <div className="flex h-screen">
      {/* Phần hiển thị câu hỏi (80%) */}
      <div className="w-4/5 p-6 border-r border-gray-300">
        <h2 className="text-2xl font-bold mb-4">Câu hỏi hiển thị ở đây</h2>
        <p className="text-lg">
          Nội dung câu hỏi sẽ được hiển thị ở khu vực này.
        </p>
      </div>

      {/* Phần hiển thị số lượng câu hỏi và thời gian (20%) */}
      <div className="w-1/5 p-6 bg-gray-100 flex flex-col justify-between">
    

        {/* Hiển thị thời gian đếm ngược */}
        <div className="text-center mb-4">
          <h3 className="text-xl font-semibold">Thời gian còn lại</h3>
          <p className="text-2xl font-bold text-red-600">{formatTime(timeLeft)}</p>
          <button
          onClick={handleSubmit}
          className="w-full py-2 bg-red-500 text-white font-bold rounded hover:bg-red-600"
        >
          Nộp bài
        </button>
        </div>

        {/* Nút nộp bài */}
        

        
      </div>
    </div>
  );
};

export default FullTestComponent;

