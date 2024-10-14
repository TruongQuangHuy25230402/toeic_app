import { getExams } from '@/actions/getExams';
import ExamList from '@/components/exam/ExamList';
import UserInfo from '@/components/user/UserInfo';
import React from 'react'

const MyExams = async () => {
  const exams = await getExams();

  if (!exams) return <div>No Exams found!</div>;
  
  return (
    <main className="flex-grow max-w-6xl mx-auto px-4"> {/* Giới hạn chiều rộng */}
      <div className="flex gap-4"> {/* Sử dụng flexbox để chia 75/25 */}
        <div className="w-3/4"> {/* 75% chiều rộng cho ExamList */}
          <ExamList exams={exams} />
        </div>
        <div className="w-1/4"> {/* 25% chiều rộng cho thông tin người dùng */}
          <UserInfo />
        </div>
      </div>
    </main>
  );
};

export default MyExams;
