import { Exams, QuestionsT } from '@prisma/client';
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button';
import AddQuestions from './AddQuestion';

interface ArrayquestionsProps {
  exams?: Exams & {
    questions: QuestionsT[];
  };
  questions: QuestionsT;
  index: number; // Thêm index vào đây
}

const Arrayquestions = ({ exams, questions, index }: ArrayquestionsProps) => {
  const [open, setOpen] = useState(false);
  const handleOpenDialogue = () => {
    setOpen((prev) => !prev);
  };

  return (
    <div className="flex justify-start items-start gap-2 flex-nowrap">
      <Button
        type="button"
        variant="outline"
        className="w-12 h-12 rounded-full flex items-center justify-center"
        onClick={handleOpenDialogue}
      >
        {index + 1} {/* Hiển thị số từ 1 đến 6 */}
      </Button>
      <Dialog open={open} onOpenChange={() => setOpen(false)}>
        <DialogTrigger asChild>
          <div />
        </DialogTrigger>
        <DialogContent className="max-w-[900px] w-[90%]">
          <DialogHeader className="px-2">
            <DialogTitle>Update Question {index + 1}</DialogTitle>
            <DialogDescription>
              Make changes to this question
            </DialogDescription>
          </DialogHeader>
          <AddQuestions
            exams={exams}
            questions={questions}
            handleDialogueOpen={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Arrayquestions;
