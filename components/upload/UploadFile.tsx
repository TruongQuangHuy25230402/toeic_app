"use client";
import React, { useState } from 'react';
import Part5 from './Part5';
import { Part5Props } from '@/actions/getPart5';
import Part1 from './Part1';
import Part2 from './Part2';
import { Part1Props } from '@/actions/getPart1';

interface UploadFileProps {
  part5ss: Part5Props[];
  part1ss: Part1Props[]; // Add this line to define part1ss in the interface
}

const UploadFile: React.FC<UploadFileProps> = ({ part5ss, part1ss }) => { // Destructure both props in a single parameter
  const [selectedPart, setSelectedPart] = useState(1); // Default selected part is Part 1

  const handleTabChange = (partNumber: number) => {
    setSelectedPart(partNumber);
  };

  return (
    <div>
      {/* Tab navigation */}
      <div className="flex space-x-4 mb-4">
        {Array.from({ length: 7 }, (_, i) => i + 1).map((part) => (
          <button
            key={part}
            onClick={() => handleTabChange(part)}
            className={`px-4 py-2 rounded-lg ${
              selectedPart === part ? 'bg-blue-600 text-white' : 'bg-gray-300 text-black'
            }`}
          >
            Part {part}
          </button>
        ))}
      </div>

      {/* Content based on selected part */}
      <div>
        {selectedPart === 1 && <Part1 part1s={part1ss || []} />}
        {selectedPart === 2 && <Part2 />}
        {selectedPart === 3 && <p>This is Part 3 content</p>}
        {selectedPart === 4 && <p>This is Part 4 content</p>}
        {selectedPart === 5 && <Part5 part5s={part5ss || []} />}
        {selectedPart === 6 && <p>This is Part 6 content</p>}
        {selectedPart === 7 && <p>This is Part 7 content</p>}
      </div>
    </div>
  );
};

export default UploadFile;
