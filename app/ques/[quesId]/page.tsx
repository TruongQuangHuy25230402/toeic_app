import React, { useState } from 'react';

import AddQues from '@/components/ques/AddQues';
import { getQuesById } from '@/actions/getQuesById';
import { getQuestions } from '@/actions/getQuestions';

interface PageProps {
  params: {
    quesId: string
  };
}

const Ques = async ({ params }: PageProps) => {
  
  const ques = await getQuesById(params.quesId);

  const questionss = await getQuestions(params.quesId);

  return (
    <div>
      {/* Pass the userId directly to the AddExams component */}
      <AddQues ques={ques}/>
    </div>
  );
}

export default Ques;
