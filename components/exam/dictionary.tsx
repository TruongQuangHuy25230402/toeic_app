"use client";
import Banner from "@/components/Banner";
import Player from "@madzadev/audio-player";
import "@madzadev/audio-player/dist/index.css";
import { useEffect, useState, useRef } from "react";
import { FaBook } from "react-icons/fa";

interface Phonetic {
  text: string;
  audio: string;
}

interface Definition {
  definition: string;
}

interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
}

interface DictionaryEntry {
  word: string;
  phonetics: Phonetic[];
  meanings: Meaning[];
}

export default function DictionaryPopup() {
  const [word, setWord] = useState("hello");
  const [dictionary, setDictionary] = useState<DictionaryEntry[] | undefined>(undefined);
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
      .then(async (res) => {
        const data = await res.json();
        setDictionary(data);
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [word]);

  const audioUrl =
    dictionary?.length && dictionary[0]?.phonetics.find((p: any) => p.audio)?.audio;

  const getLimitedMeanings = (meanings: Meaning[]) => {
    const limit = 2;
    const filteredMeanings: Record<string, Definition[]> = {};

    meanings.forEach((meaning) => {
      if (!filteredMeanings[meaning.partOfSpeech]) {
        filteredMeanings[meaning.partOfSpeech] = meaning.definitions.slice(0, limit);
      }
    });

    return filteredMeanings;
  };

  const limitedMeanings = dictionary?.length ? getLimitedMeanings(dictionary[0]?.meanings) : {};

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div>
      <button
        onClick={togglePopup}
        className="fixed bottom-10 right-10 p-3 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition duration-300"
      >
        <FaBook className="w-6 h-6" />
      </button>

      {isOpen && (
        <div
          ref={popupRef}
          className="fixed bottom-20 right-10 w-80 bg-white p-4 rounded-lg shadow-lg border border-gray-300 transition-transform transform scale-95"
          style={{ animation: 'fadeIn 0.3s' }} // Thêm hiệu ứng chuyển tiếp
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-700">Dictionary</h2>
            <button onClick={togglePopup} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>

          <Banner changeWord={setWord} />

          <div className="mb-4">
            {dictionary?.length && (
              <p className="font-semibold text-green-600">{`Phonetic: ${dictionary[0]?.phonetics[1]?.text}`}</p>
            )}
          </div>

          {Object.keys(limitedMeanings).map((partOfSpeech, index) => (
            <div key={index} className="mb-3">
              <p className="font-semibold text-gray-700">{partOfSpeech.toUpperCase()}</p>
              {limitedMeanings[partOfSpeech].map((e, i) => (
                <p key={i} className="text-gray-600 text-sm">
                  {e.definition}
                </p>
              ))}
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
