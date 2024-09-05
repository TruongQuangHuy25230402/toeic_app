import { GetServerSideProps } from 'next';
import ListeningQuestion from '@/components/ListenQues';

type Question = {
  id: string;
  questionText: string;
  audioFile?: string; // Thay đổi kiểu nếu audioFile có thể là undefined
  options: string[];
};

type ListeningExerciseProps = {
  sectionId: string;
  questions: Question[];
};

const ListeningExercise: React.FC<ListeningExerciseProps> = ({ sectionId, questions }) => {
  const handleAnswer = (questionId: string, answer: string) => {
    fetch('/api/user-answers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: 'user-id-placeholder', // Thay thế với ID của người dùng
        questionId,
        selectedOption: answer,
        isCorrect: answer === 'correct-option-placeholder', // Thay thế với đáp án đúng
      }),
    }).then((res) => res.json())
      .then((data) => console.log('Answer saved:', data));
  };

  return (
    <div>
      {questions.map((question) => (
        <ListeningQuestion
          key={question.id}
          questionText={question.questionText}
          audioFile={question.audioFile}
          options={question.options}
          onAnswer={(answer) => handleAnswer(question.id, answer)}
        />
      ))}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<ListeningExerciseProps> = async (context) => {
  const { sectionId } = context.params as { sectionId: string };

  // Fetch questions for the section from your API or database
  const response = await fetch(`${process.env.API_URL}/api/sections/${sectionId}/questions`);
  const questions = await response.json();

  return {
    props: { sectionId, questions },
  };
};

export default ListeningExercise;
