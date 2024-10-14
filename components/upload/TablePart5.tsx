"use client"
import { QuestionPart5 } from '@prisma/client';
import axios from 'axios';
import React, { useEffect, useState } from 'react'

const TablePart5 = ({ examId }: {  examId: string  }) => {
    
    const [arrPart5, setArrPart5] = useState<QuestionPart5[]>([]);
    useEffect(() => {
        const fetchQuestions = async () => {
          try {
            const res = await fetch(`/api/part5?examId=${examId}`);
            const data = await res.json();
            setArrPart5(data.part5ss);
          } catch (error) {
            console.error("Error fetching Part 5 questions:", error);
          }
        };
    
        fetchQuestions();
      }, [examId]);


  return (
    <div className="relative overflow-x-auto">
          {arrPart5 && arrPart5.length > 0 && (
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Question
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Answer 1
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Answer 2
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Answer 3
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Answer 4
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Correct
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Explanation
                  </th>
                  
                </tr>
              </thead>
              <tbody>
                {arrPart5.map((part5) => (
                  <tr
                    key={part5.id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      <div
                        className="truncate max-w-xs"
                        title={part5.questionText}
                      >
                        {part5.questionText}
                      </div>
                    </td>
                    <td className="px-6 py-4">{part5.answer1}</td>
                    <td className="px-6 py-4">{part5.answer2}</td>
                    <td className="px-6 py-4">{part5.answer3}</td>
                    <td className="px-6 py-4">{part5.answer4}</td>
                    <td className="px-6 py-4">{part5.correctAnswer}</td>
                    <td className="px-6 py-4">
                      <div
                        className="truncate max-w-xs"
                        title={part5.explainAnswer}
                      >
                        {part5.explainAnswer}
                      </div>
                    </td>
                    {/* Remove Topic ID column if not used */}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
  )
}

export default TablePart5
