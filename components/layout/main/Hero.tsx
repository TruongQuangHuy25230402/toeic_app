"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const Hero = () => {
  const router = useRouter();

  const handleQuiz = () => {
    router.push("/quiz");
  };

  return (
    <section className="relative w-full min-h-[800px] flex items-center justify-center text-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 overflow-hidden">
      {/* Animated Background Circles */}
      <div className="absolute inset-0 flex items-center justify-center -z-10">
        <div className="animate-pulse bg-blue-400 opacity-20 w-96 h-96 rounded-full blur-xl" />
        <div className="animate-pulse bg-purple-400 opacity-30 w-80 h-80 rounded-full blur-xl absolute top-20 left-1/4" />
        <div className="animate-pulse bg-pink-400 opacity-20 w-80 h-80 rounded-full blur-xl absolute top-1/2 left-3/4" />
      </div>

      <div className="px-4 md:px-6 max-w-[1200px] mx-auto w-[90%]">
        <div className="space-y-4 animate-fade-in">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl text-white transition-transform duration-500 hover:scale-105">
            Ready to take this week's TOEIC quiz?
          </h1>
          <p className="text-white text-lg md:text-xl animate-fade-in delay-300">
            Challenge yourself and aim for a higher score!
          </p>
        </div>
        <div className="mt-8 animate-bounce-in">
          <Button
            onClick={handleQuiz}
            className="inline-flex items-center justify-center rounded-full bg-yellow-400 px-10 py-4 text-lg font-semibold text-gray-900 shadow-lg transition duration-500 hover:bg-yellow-500 hover:shadow-xl"
          >
            I'm ready to start
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;