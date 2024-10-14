import { Exam, QuestionPart4, TopicPart4 } from '@prisma/client';
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
import AddPart4 from './AddPart4';

interface ArrayPart4Props {
  exam?: Exam & {
    part4s: QuestionPart4[];
  };
  part4: QuestionPart4;
  index: number; // Thêm index vào đây
  topics: TopicPart4[];
}

const ArrayPart4 = ({ exam, part4, index }: ArrayPart4Props) => {
  const [open, setOpen] = useState(false);

  const [topics, setTopics] = useState<TopicPart4[]>([]);

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
        {index + 71} {/* Hiển thị số từ 4 đến 6 */}
      </Button>
      <Dialog open={open} onOpenChange={() => setOpen(false)}>
        <DialogTrigger asChild>
          <div />
        </DialogTrigger>
        <DialogContent className="max-w-[900px] w-[90%]">
          <DialogHeader className="px-2">
            <DialogTitle>Update Question {index + 71}</DialogTitle>
            <DialogDescription>
              Make changes to this question
            </DialogDescription>
          </DialogHeader>
          <AddPart4
            exam={exam}
            part4={part4}
            handleDialogueOpen={() => setOpen(false)}
            topics={topics}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ArrayPart4;
