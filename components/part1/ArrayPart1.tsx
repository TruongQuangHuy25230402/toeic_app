import { Exam, QuestionPart1 } from '@prisma/client';
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
import AddPart1 from './AddPart1';

interface ArrayPart1Props {
  exam?: Exam & {
    part1s: QuestionPart1[];
  };
  part1: QuestionPart1;
  index: number; // Thêm index vào đây
}

const ArrayPart1 = ({ exam, part1, index }: ArrayPart1Props) => {
  const [open, setOpen] = useState(false);

  const handleOpenDialogue = () => {
    setOpen((prev) => !prev);
  };

  return (
    <div>
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
            <DialogTitle>Update Room {index + 1}</DialogTitle>
            <DialogDescription>
              Make changes to this room
            </DialogDescription>
          </DialogHeader>
          <AddPart1
            exam={exam}
            part1={part1}
            handleDialogueOpen={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ArrayPart1;
