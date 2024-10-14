import { Exam, QuestionPart5, TopicPart5 } from '@prisma/client';
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
import AddPart5 from './AddPart5';

interface ArrayPart5Props {
  exam?: Exam & {
    part5s: QuestionPart5[];
  };
  part5: QuestionPart5;
  index: number; // Thêm index vào đây
  topics: TopicPart5[];
}

const ArrayPart5 = ({ exam, part5, index }: ArrayPart5Props) => {
  const [open, setOpen] = useState(false);

  const [topics, setTopics] = useState<TopicPart5[]>([]);


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
        {index + 101} {/* Hiển thị số từ 5 đến 6 */}
      </Button>
      <Dialog open={open} onOpenChange={() => setOpen(false)}>
        <DialogTrigger asChild>
          <div />
        </DialogTrigger>
        <DialogContent className="max-w-[900px] w-[90%]">
          <DialogHeader className="px-2">
            <DialogTitle>Update Question {index + 101}</DialogTitle>
            <DialogDescription>
              Make changes to this question
            </DialogDescription>
          </DialogHeader>
          <AddPart5
            exam={exam}
            part5={part5}
            handleDialogueOpen={() => setOpen(false)}
            topics={topics}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ArrayPart5;
