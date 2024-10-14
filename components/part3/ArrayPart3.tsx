import { Exam, QuestionPart3, TopicPart3 } from '@prisma/client';
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
import AddPart3 from './AddPart3';

interface ArrayPart3Props {
  exam?: Exam & {
    part3s: QuestionPart3[];
  };
  part3: QuestionPart3;
  index: number; // Thêm index vào đây
  topics: TopicPart3[];

}

const ArrayPart3 = ({ exam, part3, index }: ArrayPart3Props) => {
  const [open, setOpen] = useState(false);

  const [topics, setTopics] = useState<TopicPart3[]>([]);

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
        {index + 32} {/* Hiển thị số từ 3 đến 6 */}
      </Button>
      <Dialog open={open} onOpenChange={() => setOpen(false)}>
        <DialogTrigger asChild>
          <div />
        </DialogTrigger>
        <DialogContent className="max-w-[900px] w-[90%]">
          <DialogHeader className="px-2">
            <DialogTitle>Update Question {index + 32}</DialogTitle>
            <DialogDescription>
              Make changes to this question
            </DialogDescription>
          </DialogHeader>
          <AddPart3
            exam={exam}
            part3={part3}
            handleDialogueOpen={() => setOpen(false)}
            topics={topics}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ArrayPart3;
