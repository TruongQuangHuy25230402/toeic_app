
import { useState } from "react";
import { Dialog } from "@headlessui/react";
import AddVocabulary from "./AddVoca";

export default function VocabularyContainer() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  return (
    <div>
      <button onClick={openDialog} className="p-3 bg-green-600 text-white rounded-full shadow-md hover:bg-green-700 transition duration-300">
        Open Vocabulary Dialog
      </button>

      <Dialog open={isDialogOpen} onClose={closeDialog} className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <AddVocabulary handleDialogueOpen={closeDialog} />
          <button onClick={closeDialog} className="mt-4 text-red-500 hover:text-red-700">Close</button>
        </div>
      </Dialog>
    </div>
  );
}
