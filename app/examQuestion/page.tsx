'use client';

import React, { useEffect, useState } from 'react';
import { fetchExamQuestions, fetchExams, fetchQuestions, submitExamQuestionRelation } from './actions'; // Import actions
import { useRouter } from 'next/navigation'; // Import the useRouter hook

const ExamQuestionPage: React.FC = () => {
  const [exams, setExams] = useState<any[]>([]); // Ensure it's initialized as an empty array
  const [questions, setQuestions] = useState<any[]>([]); // Ensure it's initialized as an empty array
  const [examQuestions, setExamQuestions] = useState<any[]>([]);
  const [selectedExams, setSelectedExams] = useState<string[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter(); // Initialize the useRouter hook


  console.log(exams);
  console.log(questions);
  console.log(examQuestions);

  // Fetch exams and questions on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const examsData = await fetchExams();
        setExams(examsData);
        
        const questionsData = await fetchQuestions();
        setQuestions(questionsData);

        const examQuestionsData = await fetchExamQuestions(); // Fetch all exam questions
        setExamQuestions(examQuestionsData); // Store the fetched exam questions
        
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    loadData();
  }, []);



  // Handle exam selection
  const handleExamSelect = (examsId: string) => {
    setSelectedExams((prev) =>
      prev.includes(examsId) ? prev.filter((id) => id !== examsId) : [...prev, examsId]
    );
  };

  // Handle question selection
  const handleQuestionSelect = (quesId: string) => {
    setSelectedQuestions((prev) =>
      prev.includes(quesId) ? prev.filter((id) => id !== quesId) : [...prev, quesId]
    );
  };

  const handleExamClick = (examId: string) => {
    router.push(`/exams/${examId}`); // Redirect to the exam page
  };

  const handleQuestionClick = (questionId: string) => {
    router.push(`/questions/${questionId}`); // Redirect to the question page
  };

  // Handle form submission
  const handleSubmit = async () => {
    setIsLoading(true);
  
    if (selectedQuestions.length === 0 || selectedExams.length === 0) {
      alert("Please select both questions and exams before submitting.");
      setIsLoading(false);
      return;
    }
  
    try {
      const result = await submitExamQuestionRelation(selectedExams, selectedQuestions);
  
      if (result && result.message) {
        alert(result.message);
      } else {
        alert("Successfully saved relationships.");
      }
    } catch (error: any) {
      console.error("Error saving relationships:", error);
      
      // Check if the error message indicates a duplicate
      const message = error.message.includes("Duplicate relationship detected")
        ? error.message
        : error?.response?.data || "An error occurred while saving the relationships.";
        
      alert(message);
    } finally {
      setIsLoading(false);
    }
  };
  
  
  


  
  

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Link Exams and Questions</h1>

      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Select Exams</h3>
        {exams && exams.length > 0 ? (
          exams.map((exam) => (
            <div key={exam.id} className="flex items-center space-x-2 mb-2">
              <input
                type="checkbox"
                id={`exam-${exam.id}`}
                checked={selectedExams.includes(exam.id)}
                onChange={() => handleExamSelect(exam.id)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor={`exam-${exam.id}`} className="text-gray-700">
                <span 
                  className="cursor-pointer text-blue-500 hover:underline"
                  onClick={() => handleExamClick(exam.id)} // Navigate on click
                >
                  {exam.title}
                </span>
              </label>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No exams available.</p>
        )}
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Select Questions</h3>
        {questions && questions.length > 0 ? (
          questions.map((question) => (
            <div key={question.id} className="flex items-center space-x-2 mb-2">
              <input
                type="checkbox"
                id={`question-${question.id}`}
                checked={selectedQuestions.includes(question.id)}
                onChange={() => handleQuestionSelect(question.id)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor={`question-${question.id}`} className="text-gray-700">
                <span
                  className="cursor-pointer text-blue-500 hover:underline"
                  onClick={() => handleQuestionClick(question.id)} // Navigate on click
                >
                  {question.title}
                </span>
                
              </label>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No questions available.</p>
        )}
      </div>

      <button
        onClick={handleSubmit}
        className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        disabled={isLoading}
      >
        {isLoading ? 'Saving...' : 'Save Relationships'}
      </button>

      
    </div>
  );
};

export default ExamQuestionPage;
