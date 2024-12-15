import { getListExams } from '@/actions/getListExams';
import { getUAnswer } from '@/actions/getUAnswer';
import ExamsList from '@/components/exams/ExamsList';
import UserInfo from '@/components/user/UserInfo';
import React from 'react';

interface ExamsProps {
  searchParams: {
    title: string;
  };
}

const MyExam = async ({ searchParams }: ExamsProps) => {
  try {
    const exams = await getListExams(searchParams);
    const user_Answers = await getUAnswer();

    if (!exams || !user_Answers) {
      return <div>No Exams or User Answers found!</div>;
    }

    return (
      <main className="flex-grow max-w-6xl mx-auto px-4">
        {/* Layout with 75/25 split */}
        <div className="flex gap-4">
          {/* Exam List (75% width) */}
          <div className="w-3/4">
            <ExamsList exams={exams} user_Answers={user_Answers} />
          </div>
          {/* User Info (25% width) */}
          <div className="w-1/4">
            {user_Answers[0]?.userId ? (
              <UserInfo userId={user_Answers[0].userId} />
            ) : (
              <div>No User Info Available</div>
            )}
          </div>
        </div>
      </main>
    );
  } catch (error) {
    console.error('Error fetching data:', error);
    return <div>Error loading data!</div>;
  }
};

export default MyExam;
