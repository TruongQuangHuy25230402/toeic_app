import { Exam, QuestionPart2, TopicPart2 } from '@prisma/client';
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
import AddPart2 from './AddPart2';

interface ArrayPart2Props {
  exam?: Exam & {
    part2s: QuestionPart2[];
  };
  part2: QuestionPart2;
  index: number; // Thêm index vào đây
  topics: TopicPart2[];
}

const ArrayPart2 = ({ exam, part2, index }: ArrayPart2Props) => {
  const [open, setOpen] = useState(false);
  const [topics, setTopics] = useState<TopicPart2[]>([]);

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
        {index + 7} {/* Hiển thị số từ 2 đến 6 */}
      </Button>
      <Dialog open={open} onOpenChange={() => setOpen(false)}>
        <DialogTrigger asChild>
          <div />
        </DialogTrigger>
        <DialogContent className="max-w-[900px] w-[90%]">
          <DialogHeader className="px-2">
            <DialogTitle>Update Question {index + 7}</DialogTitle>
            <DialogDescription>
              Make changes to this room
            </DialogDescription>
          </DialogHeader>
          <AddPart2
            exam={exam}
            part2={part2}
            handleDialogueOpen={() => setOpen(false)}
            topics={topics}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ArrayPart2;
