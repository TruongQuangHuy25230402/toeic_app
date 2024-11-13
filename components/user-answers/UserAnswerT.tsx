"use client"
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

const UserAnswerT = () => {
  const [userAnswer, setUserAnswer] = useState<any>(null);
  const [UserAnswer_Detail, setUserAnswer_Detail] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetch(`/api/userAnswersT/${id}`)
        .then((response) => response.json())
        .then((data) => {
          setUserAnswer(data);
          console.log(data)
          setUserAnswer_Detail(data.UserAnswer_Detail || []);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching user answer:', error);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Loading...
      </div>
    );
  }

  if (!userAnswer || UserAnswer_Detail.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        No user answer details found.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Answer Details
      </h2>
      <div className="space-y-4">
        {UserAnswer_Detail.map((detail: any, index: number) => {
          // Find the correct question part based on `questionId`
          const questionPart = 
            detail.question?.id === detail.questionId ? detail.question :
            null;

          return (
            <div key={detail.id} className="p-6 bg-white rounded-lg shadow-md">
              {questionPart ? (
                <>
                  <p className="text-lg font-semibold text-gray-700">
                  Câu số: {index + 1} ||
                    Question: {questionPart.questionText || 'N/A'}
                  </p>
                  {questionPart.imageFile && (
                    <img src={questionPart.imageFile} alt="Question Image" className="w-1/2 max-w-xs h-auto mt-2 rounded-md" />

                  )}
                  {questionPart.audioFile && (
                    <audio controls className="w-full mt-2">
                      <source src={questionPart.audioFile} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  )}
                  <div className="mt-4">
                    <h4 className="text-lg font-semibold text-gray-800">Answer Options:</h4>
                    <ul className="list-disc list-inside text-gray-700">
                      <li>{questionPart.answer1 || 'N/A'}</li>
                      <li>{questionPart.answer2 || 'N/A'}</li>
                      <li>{questionPart.answer3 || 'N/A'}</li>
                      <li>{questionPart.answer4 || 'N/A'}</li>
                    </ul>
                  </div>
                  {questionPart.explainAnswer && (
                    <div className="mt-4">
                      <h4 className="text-lg font-semibold text-gray-800">Explanation:</h4>
                      <p className="text-gray-700">{questionPart.explainAnswer}</p>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-gray-700">Question details not found.</p>
              )}

              <p className="text-lg text-gray-700 mt-4">
                <span className="font-semibold">Selected Answer:</span> {detail.selectedAnswer}
              </p>
              <p className="text-lg text-gray-700">
                <span className="font-semibold">Is Correct:</span> {detail.isCorrect ? 'Yes' : 'No'}
              </p>
              <p className="text-lg text-gray-700">
                <span className="font-semibold">Skipped:</span> {detail.isSkipped ? 'Yes' : 'No'}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserAnswerT;
