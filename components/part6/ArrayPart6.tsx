import { Exam, QuestionPart6 } from '@prisma/client';
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
import AddPart6 from './AddPart6';

interface ArrayPart6Props {
  exam?: Exam & {
    part6s: QuestionPart6[];
  };
  part6: QuestionPart6;
  index: number; // Thêm index vào đây
}

const ArrayPart6 = ({ exam, part6, index }: ArrayPart6Props) => {
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
        {index + 1} {/* Hiển thị số từ 6 đến 6 */}
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
          <AddPart6
            exam={exam}
            part6={part6}
            handleDialogueOpen={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ArrayPart6;
