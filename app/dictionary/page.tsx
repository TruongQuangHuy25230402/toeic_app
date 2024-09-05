"use client";
import Banner from "@/components/Banner";
import Player from "@madzadev/audio-player";
import "@madzadev/audio-player/dist/index.css";
import { useEffect, useState } from "react";
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

const colors = {
  tagsBackground: "#3e32e4",
  tagsText: "#ffffff",
  tagsBackgroundHoverActive: "#6e65f1",
  tagsTextHoverActive: "#ffffff",
  searchBackground: "#18191f",
  searchText: "#ffffff",
  searchPlaceHolder: "#575a77",
  playerBackground: "#000",
  titleColor: "#16A343",
  timeColor: "#16A343",
  progressSlider: "#16A343",
  progressUsed: "#16A343",
  progressLeft: "#16A343",
  bufferLoaded: "#16A343",
  volumeSlider: "#3e32e4",
  volumeUsed: "#ffffff",
  volumeLeft: "#151616",
  playlistBackground: "#fff",
  playlistText: "#575a77",
  playlistBackgroundHoverActive: "#18191f",
  playlistTextHoverActive: "#ffffff",
};

export default function Home() {
  const [word, setWord] = useState("hello");
  const [dictionary, setDictionary] = useState<DictionaryEntry[] | undefined>(undefined);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Hàm để cuộn đến cuối trang
  const scrollToBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
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

  // Lấy URL âm thanh từ API
  const audioUrl =
    dictionary?.length && dictionary[0]?.phonetics.find((p: any) => p.audio)?.audio;

  // Hàm để lấy 1-3 định nghĩa cho mỗi loại từ
  const getLimitedMeanings = (meanings: Meaning[]) => {
    const limit = 3; // Số lượng định nghĩa tối đa cho mỗi loại từ
    const filteredMeanings: Record<string, Definition[]> = {};

    meanings.forEach((meaning) => {
      if (!filteredMeanings[meaning.partOfSpeech]) {
        filteredMeanings[meaning.partOfSpeech] = meaning.definitions.slice(0, limit);
      }
    });

    return filteredMeanings;
  };

  const limitedMeanings = dictionary?.length ? getLimitedMeanings(dictionary[0]?.meanings) : {};


  return (
    <div>
      <Banner changeWord={setWord} />
      <section className="top-[27vh] bg-white w-[80%] ml-[10%] shadow-2xl p-5 rounded-2xl">
        <div className="flex justify-between">
          <span className="shadow-md px-6 py-2 rounded-lg bg-green-600 text-white">
            <span className="h-[10px] w-[10px] bg-yellow-300 rounded-full inline-block"></span> {word}
          </span>
          <h1 className="text-xl font-extrabold text-gray-900 md:text-2xl lg:text-3xl">
            <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
              FIND IN
            </span>{" "}
            DICTIONARY
          </h1>
          {dictionary?.length && (
            <span className="shadow-md px-6 py-2 rounded-lg bg-blue-600 text-white">
              <span className="h-[10px] w-[10px] bg-blue-300 rounded-full inline-block"></span>{" "}
              {`phonetic: ${dictionary[0]?.phonetics[1]?.text}`}
            </span>
          )}
        </div>

        <section className="mt-5 pt-4 border-solid border-0 border-t border-gray-300">
          <span className="shadow-md px-6 py-2 rounded-lg font-semibold bg-white text-green-700 flex items-center justify-between max-w-[120px]">
            <span className="h-[10px] w-[10px] bg-yellow-300 rounded-full inline-block"></span>Origin
          </span>
          <p className="py-3 text-gray-600 bg-gray-100 mt-4 px-4 rounded-lg">
            "early 19th century: variant of earlier hollo; related to holla."
          </p>
        </section>

        {Object.keys(limitedMeanings).map((partOfSpeech, index) => (
            <section key={index} className="mt-8 shadow-2xl p-5 rounded-xl bg-gray-100">
              <span className="shadow-md px-6 py-3 rounded-lg font-semibold bg-gray-600 text-white flex items-center justify-between max-w-[150px]">
                <span className="h-[10px] w-[10px] bg-white rounded-full inline-block"></span>MEANING
              </span>
              <div>
                <span className="shadow-sm mt-4 px-3 py-2 rounded-full font-semibold bg-white text-green-700 flex items-center justify-between max-w-[330px]">
                  <span className="h-[10px] w-[10px] bg-yellow-300 rounded-full inline-block"></span>Part of speech{" "}
                  <span className="shadow-md px-6 py-2 rounded-full font-semibold bg-green-600 text-white flex items-center justify-between max-w-[400px]">
                    {partOfSpeech.toUpperCase()}
                  </span>{" "}
                </span>
                <div>
              {limitedMeanings[partOfSpeech].map((e, i) => (
                <p key={i} className="py-3 text-gray-600 bg-white mt-4 px-4 rounded-lg">
                  {e.definition}
                </p>
              ))}
            </div>
              </div>
            </section>
          ))}

        <div className="mt-4">
          {audioUrl && (
            <Player
              key={audioUrl} // Thay đổi key khi URL âm thanh thay đổi
              includeTags={false}
              includeSearch={false}
              showPlaylist={false}
              sortTracks={false}
              autoPlayNextTrack={false}
              trackList={[
                {
                  url: audioUrl, // Sử dụng URL âm thanh từ API
                  title: word,
                  tags: [word],
                },
              ]}
              customColorScheme={colors}
            />
          )}
        </div>
      </section>

      
      <div className="fixed bottom-10 right-10 flex flex-col gap-4">
        {/* Nút lên */}
        <button
          onClick={scrollToTop}
          className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 15l-7-7-7 7"
            />
          </svg>
        </button>
        {/* Nút xuống */}
        <button
          onClick={scrollToBottom}
          className="w-10 h-10 flex items-center justify-center bg-green-600 text-white rounded-full shadow-md hover:bg-green-700 transition duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 9l7 7 7-7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
