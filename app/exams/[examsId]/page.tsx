import React, { useState } from 'react';
import { getExamsById } from '@/actions/getExamsById'; // Your existing API call
import AddExams from '@/components/exams/AddExams'; // Component to handle exam creation
import { getQuestions } from '@/actions/getQuestions';

interface ExamsPageProps {
  params: {
    examsId: string;
  };
}

const Exams = async ({ params }: ExamsPageProps) => {
  
  const exams = await getExamsById(params.examsId);
  const questionss = await getQuestions(params.examsId);

  

  return (
    <div>
      {/* Pass the userId directly to the AddExams component */}
      <AddExams exams={exams} question={questionss || []}  />
    </div>
  );
}

export default Exams;
