"use client";
import React, { useState } from 'react';
import Part5 from './Part5';
import { Part5Props } from '@/actions/getPart5';
import Part1 from './Part1';
import Part2 from './Part2';
import { Part1Props } from '@/actions/getPart1';
import { Part2Props } from '@/actions/getPart2';
import { Part3Props } from '@/actions/getPart3';
import { Part7Props } from '@/actions/getPart7';
import { Part6Props } from '@/actions/getPart6';
import { Part4Props } from '@/actions/getPart4';
import Part3 from './Part3';
import Part4 from './Part4';
import Part6 from './Part6';
import Part7 from './Part7';

interface UploadFileProps {
  part5ss: Part5Props[];
  part1ss: Part1Props[]; // Add this line to define part1ss in the interface
  part2ss: Part2Props[]; // Add this line to define part1ss in the interface
  part3ss: Part3Props[]; // Add this line to define part1ss in the interface
  part4ss: Part4Props[]; // Add this line to define part1ss in the interface
  part7ss: Part7Props[]; // Add this line to define part1ss in the interface
  part6ss: Part6Props[]; // Add this line to define part1ss in the interface
}

const UploadFile: React.FC<UploadFileProps> = ({ part5ss, part1ss, part2ss, part3ss, part4ss, part6ss,part7ss }) => { // Destructure both props in a single parameter
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
        {selectedPart === 2 && <Part2 part2s={part2ss || []} />}
        {selectedPart === 3 && <Part3 part3s={part3ss || []} />}
        {selectedPart === 4 && <Part4 part4s={part4ss || []} />}
        {selectedPart === 5 && <Part5 part5s={part5ss || []} />}
        {selectedPart === 6 && <Part6 part6s={part6ss || []} />}
        {selectedPart === 7 && <Part7 part7s={part7ss || []} />}
      </div>
    </div>
  );
};

export default UploadFile;
