"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const Hero = () => {
  const router = useRouter();

  const handleQuiz = () => {
    router.push("/quiz");
  };

  return (
    <section
      className="relative w-full min-h-[800px] flex items-center justify-center text-center bg-cover bg-center overflow-hidden"
      style={{
        backgroundImage: "url('/uploads/image/bgr.jpg')",
      }}
    >
      {/* Overlay để làm rõ text */}
      <div className="absolute inset-0 bg-black bg-opacity-40 -z-10" />

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
