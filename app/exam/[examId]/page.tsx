import { getExamById } from '@/actions/getExamById'
import { getPart5 } from '@/actions/getPart5'
import AddToeicExamForm from '@/components/exam/AddToeicExamForm'
import React from 'react'

interface ExamPageProps {
    params: {
        examId: string
    }
}

const Exam = async({params} : ExamPageProps) => {
    const exam = await getExamById(params.examId); // tại actions getExamById.ts
    const part5s = await getPart5();
  return (
    <div>
      <AddToeicExamForm exam={exam} part5={part5s || []} />
    </div>
  )
}

export default Exam
