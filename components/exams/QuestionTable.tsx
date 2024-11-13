import { FC, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Question {
  id: string;
  title: string;
  questionText?: string;
  answer1?: string;
  answer2?: string;
  answer3?: string;
  answer4?: string;
  correctAnswer?: string;
  explainAnswer?: string;
  part?: string;
}



interface QuestionTableProps {
  questions: Question[];
  onToggleDetails: (id: string) => void;
  expandedQuestionId: string | null;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const QuestionTable: FC<QuestionTableProps> = ({
  questions,
  onToggleDetails,
  expandedQuestionId,
  onEdit,
  onDelete,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);

  const handleOpenDialog = (question: Question) => {
    setSelectedQuestion(question);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedQuestion(null);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg">
        <thead>
          <tr>
            <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Title</th>
            <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Part</th>
            <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Question Text</th>
            <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((question) => (
            <tr key={question.id}>
              <td className="px-6 py-4 border-b border-gray-200 text-sm">{question.id}</td>
              <td className="px-6 py-4 border-b border-gray-200 text-sm">{question.title}</td>
              <td className="px-6 py-4 border-b border-gray-200 text-sm">{question.part}</td>
              <td className="px-6 py-4 border-b border-gray-200 text-sm">
                {question.questionText || 'No question text available'}
              </td>
              <td className="px-6 py-4 border-b border-gray-200 text-sm flex space-x-2">
                <button
                  onClick={() => handleOpenDialog(question)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Chi tiết
                </button>
                <button
                  type="button"
                  onClick={() => onEdit(question.id)}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Chỉnh sửa
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(question.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Dialog for showing detailed information */}
      {selectedQuestion && (
        <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
          <DialogTrigger asChild>
            <button className="hidden" />
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Chi tiết câu hỏi</DialogTitle>
            <DialogDescription>
              <p><strong>Answer1:</strong> {selectedQuestion.answer1}</p>
              <p><strong>Answer2:</strong> {selectedQuestion.answer2}</p>
              <p><strong>Answer3:</strong> {selectedQuestion.answer3}</p>
              <p><strong>Answer4:</strong> {selectedQuestion.answer4}</p>
              <p><strong>Correct Answer:</strong> {selectedQuestion.correctAnswer}</p>
              <p><strong>Explain Answer:</strong> {selectedQuestion.explainAnswer}</p>
            </DialogDescription>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default QuestionTable;
