import { getExamById } from '@/actions/getExamById'
import AddToeicExamForm from '@/components/exam/AddToeicExamForm'
import React from 'react'

interface ExamPageProps {
    params: {
        examId: string
    }
}

const Exam = async({params} : ExamPageProps) => {
    const exam = await getExamById(params.examId) // tại actions getExamById.ts
  return (
    <div>
      <AddToeicExamForm exam={exam}/>
    </div>
  )
}

export default Exam
