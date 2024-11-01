import { Exam, QuestionPart4, TopicPart4 } from '@prisma/client';
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button';
import AnswerPart4 from './AnswerPart4';

// Define the UserAnswerDetail interface separately for clarity
interface UserAnswerDetail {
  id: string;
  userAnswerId: string; // UserAnswer ID
  questionId: string; // The ID of the question this detail corresponds to
  selectedAnswer: string; // The answer selected by the user
  isCorrect: boolean; // To check if the answer is correct
  isSkipped: boolean; // To check if the question was skipped
  createdAt: Date;
  updatedAt: Date;
}

interface ArrayPart4Props {
  exam?: Exam & {
    part4s: QuestionPart4[];
  };
  part4: QuestionPart4;
  index: number; // Add index here
  topics: TopicPart4[];
  userAnswerDetail?: UserAnswerDetail | null; // Changed to indicate it can be a single object or null
}

const Arr4 = ({ exam, part4, index, topics, userAnswerDetail = null }: ArrayPart4Props) => {
  const [open, setOpen] = useState(false);

  const handleOpenDialogue = () => {
    setOpen(true);
  };

  const handleCloseDialogue = () => {
    setOpen(false);
  };

  // Get the selected answer for the current part
  const currentUserAnswerDetail = userAnswerDetail;

  // Determine the icon based on the answer status
  const getAnswerIcon = () => {
    if (!currentUserAnswerDetail) return ''; // No answer selected
    return currentUserAnswerDetail.selectedAnswer === part4.correctAnswer 
      ? '✓' // Checkmark for correct
      : '✗'; // Cross for incorrect
  };

  // Determine the display text for the selected answer
  // Hàm lấy ký tự đầu của đáp án được chọn
const displaySelectedAnswer = () => {
  if (!currentUserAnswerDetail) return 'Bỏ qua'; // Nếu không có đáp án đã chọn
  return `(${currentUserAnswerDetail.selectedAnswer.charAt(1)})`; // Lấy ký tự đầu tiên (ví dụ: (B))
};

// Hàm lấy ký tự đầu của đáp án đúng
const displayCorrectAnswer = () => {
  return `(${part4.correctAnswer.charAt(1)})`; // Lấy ký tự đầu tiên (ví dụ: (B))
};

const buttonColorClass = currentUserAnswerDetail && currentUserAnswerDetail.selectedAnswer
  ? currentUserAnswerDetail.selectedAnswer === part4.correctAnswer
    ? 'bg-green-400' // Green for correct answer
    : 'bg-red-400' // Red for incorrect answer
  : 'bg-gray-200'; // Gray for unanswered

  return (
    <div className="flex flex-col justify-start items-start gap-2 flex-nowrap">
      {/* Display the question number and answer icon */}
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          className={`w-12 h-12 rounded-full flex items-center justify-center ${buttonColorClass}`}
          onClick={handleOpenDialogue}
        >
          {index + 71} {/* Display number from 4 */}
        </Button>

        {/* Display answer icon and selected answer directly in the interface */}
        <h1 className="flex items-center">
          {getAnswerIcon()} {/* Display the answer icon */}
          <span className="ml-2">
          Choose {displaySelectedAnswer()} ||| Correct {displayCorrectAnswer()}
          </span>
        </h1>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {/* Trigger button is already set above, so no need for additional trigger here */}
          <span></span>
        </DialogTrigger>

        <DialogContent className="max-w-[900px] w-[90%]">
          <DialogHeader className="px-2">
            <DialogTitle>Thông tin Câu hỏi {index + 71}</DialogTitle>
          </DialogHeader>

          <AnswerPart4
            exam={exam}
            part4={part4}
            handleDialogueOpen={handleCloseDialogue}
            topics={topics}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Arr4;
