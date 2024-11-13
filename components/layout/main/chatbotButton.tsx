"use client"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaRobot } from "react-icons/fa";

const ChatbotButton = () => {
  const router = useRouter();

  const handleChatbot = () => {
    router.push("/chatbot"); 
  };

  return (
    <Link href={"https://chatgpt.com/g/g-KIr8iJuZI-codequiz"} className="relative" >
      <div className="fixed bottom-8 right-8 flex items-center group">
        <button
          onClick={handleChatbot}
          className="p-4 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 transition duration-300 flex items-center justify-center"
          aria-label="Open Chatbot"
        >
          <FaRobot className="text-2xl" />
        </button>
        <span className="absolute bottom-16 right-1/2 transform translate-x-1/2 -translate-y-2 hidden group-hover:flex items-center justify-center bg-gray-800 text-white text-sm py-2 px-3 rounded-lg shadow-lg transition-opacity duration-300 opacity-0 group-hover:opacity-100">
          Click me to join ChatGPT4 chatbot
          <span className="absolute w-3 h-3 bg-gray-800 transform rotate-45 bottom-[-6px] left-1/2 translate-x-[-50%]"></span>
        </span>
      </div>
    </Link>
  );
};

export default ChatbotButton;