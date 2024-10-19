import { getExamById } from '@/actions/getExamById'
import { getPart5 } from '@/actions/getPart5'
import {getPart1} from '@/actions/getPart1'
import AddToeicExamForm from '@/components/exam/AddToeicExamForm'
import React from 'react'

interface ExamPageProps {
    params: {
        examId: string
    }
}

const Exam = async({params} : ExamPageProps) => {
    const exam = await getExamById(params.examId); // tại actions getExamById.ts
    const part5s = await getPart5(params.examId);
    const part1s = await getPart1(params.examId)
  return (
    <div>
      <AddToeicExamForm exam={exam} part1={part1s || []} part5={part5s || []} />
    </div>
  )
}

export default Exam
