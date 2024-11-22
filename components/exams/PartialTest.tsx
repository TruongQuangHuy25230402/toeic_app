import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Question {
  id: string;
  title: string;
  ques: string;
  answer1: string;
  answer2: string;
  answer3: string;
  answer4: string;
  correctAnswer: string;
  explainAnswer: string;
  audioFile: string;
  imageFile: string;
  part: string;
}

interface PartialTestProps {
  examId: string;
}

const PartialTest: React.FC<PartialTestProps> = ({ examId }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`/api/exams/${examId}`);
        console.log('API Response:', response.data); // Log the entire response

        // Check if 'arr' exists in the response data
        if (response.data && Array.isArray(response.data.exams)) {
          const fetchedQuestions = response.data.exams.map((item: any) => item.ques);
          setQuestions(fetchedQuestions); // Set the questions array from the nested structure
        } else {
          throw new Error("Invalid response structure: 'arr' not found.");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setError("Failed to fetch questions. Please try again later.");
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [examId]);

  if (loading) {
    return <p className="text-center text-gray-500">Loading questions...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-6 text-center">Exam Questions</h1>
      {questions.length > 0 ? (
        questions.map((question, index) => (
          <div key={question.id} className="mb-8 p-4 bg-gray-100 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium">{`${index + 1}. ${question.title}`}</h2>
            
            {/* Display question text if available */}
            <p className="text-gray-700 mb-4">{question.ques}</p>
            
            {/* Display image if available */}
            {question.imageFile && (
              <img
                src={question.imageFile}
                alt="Question related"
                className="w-full h-auto mb-4 rounded"
              />
            )}

            {/* Display audio if available */}
            {question.audioFile && (
              <audio controls className="mb-4 w-full">
                <source src={question.audioFile} type="audio/mp3" />
                Your browser does not support the audio element.
              </audio>
            )}

            {/* Answer Options */}
            <div className="space-y-2">
              {['answer1', 'answer2', 'answer3', 'answer4'].map((key, idx) => (
                <div key={key} className="flex items-center">
                  <span className="mr-2 font-semibold">{String.fromCharCode(65 + idx)}.</span>
                  <p className="text-gray-700">{question[key as keyof Question]}</p>
                </div>
              ))}
            </div>
            
            {/* Explanation */}
            <details className="mt-4 text-sm text-gray-600 cursor-pointer">
              <summary className="font-semibold text-blue-500">Explanation</summary>
              <p>{question.explainAnswer}</p>
            </details>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">No questions available for this exam.</p>
      )}
    </div>
  );
};

export default PartialTest;
