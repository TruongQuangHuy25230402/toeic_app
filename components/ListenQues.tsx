// File: components/ListeningQuestion.tsx

import { useState } from 'react';

type ListeningQuestionProps = {
  questionText: string;
  audioFile?: string; // cho phép undefined
  options: string[];
  onAnswer: (answer: string) => void;
};

const ListeningQuestion: React.FC<ListeningQuestionProps> = ({ questionText, audioFile, options, onAnswer }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    onAnswer(option);
  };

  return (
    <div>
      <p>{questionText}</p>
      <audio controls>
        <source src={audioFile} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <div>
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionClick(option)}
            style={{ backgroundColor: selectedOption === option ? 'lightblue' : 'white' }}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ListeningQuestion;
