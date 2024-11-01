import { getExamById } from '@/actions/getExamById'
import { getPart5 } from '@/actions/getPart5'
import {getPart1} from '@/actions/getPart1'
import {getPart2} from '@/actions/getPart2'
import {getPart3} from '@/actions/getPart3'
import {getPart4} from '@/actions/getPart4'
import {getPart6} from '@/actions/getPart6'
import {getPart7} from '@/actions/getPart7'
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
    const part1s = await getPart1(params.examId);
    const part2s = await getPart2(params.examId);
    const part3s = await getPart3(params.examId);
    const part4s = await getPart4(params.examId);
    const part6s = await getPart6(params.examId);
    const part7s = await getPart7(params.examId);
    
  return (
    <div>
      <AddToeicExamForm exam={exam} part1={part1s || []} part2={part2s || []} part5={part5s || []} part3={part3s || []} part4={part4s || []} part6={part6s || []} part7={part7s || []}  />
    </div>
  )
}

export default Exam
