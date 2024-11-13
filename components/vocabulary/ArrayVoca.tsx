import {  User, Vocabulary } from '@prisma/client';
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
import AddVocabulary from './AddVoca';

interface VocabularyFormProps {
    user?: User & {
      vocabularies: Vocabulary[];
    };
    vocabulary?: Vocabulary;
    index: number;
  }

const ArrayVocabulary = ({ user, vocabulary, index }: VocabularyFormProps) => {
  const [open, setOpen] = useState(false);
  const [records, setRecords] = useState<Vocabulary[]>([]);
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
            <DialogTitle>Update Record {index + 1}</DialogTitle>
            <DialogDescription>
              Make changes to this room
            </DialogDescription>
          </DialogHeader>
          <AddVocabulary
            vocabulary={vocabulary}
            handleDialogueOpen={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ArrayVocabulary;
