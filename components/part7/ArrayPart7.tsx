import { Exam, QuestionPart7 } from '@prisma/client';
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
import AddPart7 from './AddPart7';

interface ArrayPart7Props {
  exam?: Exam & {
    part7s: QuestionPart7[];
  };
  part7: QuestionPart7;
  index: number; // Thêm index vào đây
}

const ArrayPart7 = ({ exam, part7, index }: ArrayPart7Props) => {
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
        {index + 1} {/* Hiển thị số từ 7 đến 6 */}
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
          <AddPart7
            exam={exam}
            part7={part7}
            handleDialogueOpen={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ArrayPart7;
