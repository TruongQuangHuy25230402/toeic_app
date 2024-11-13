import React, { useState } from 'react';

import AddQues from '@/components/ques/AddQues';
import { getQuesById } from '@/actions/getQuesById';

interface PageProps {
  params: {
    questionId: string
  };
}

const Ques = async ({ params }: PageProps) => {
  
  const ques = await getQuesById(params.questionId);

  return (
    <div>
      {/* Pass the userId directly to the AddExams component */}
      <AddQues ques={ques}/>
    </div>
  );
}

export default Ques;
