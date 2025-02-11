import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type BoardButtonProps = {
  activity: number;
  setActivity: (value: number) => void;
};

export default function LeaderBoardButton({ activity, setActivity }: BoardButtonProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640); // Tailwind's sm breakpoint
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative flex flex-col self-center sm:flex-row background sm:rounded-full rounded-3xl h-fit sm:w-full w-52 gap-2 sm:gap-12">
      {/* Effet de slide */}
      <motion.div
        className="absolute bg-[#00C8C8] sm:rounded-full rounded-3xl self-center"
        style={{ width: isMobile ? `calc(100%)` : `calc(100% / 6)`, height: isMobile ? `calc(100% / 6)` : '100%' }}
        animate={isMobile ? { y: `${activity * 100}%` } : { x: `${activity * 100}%` }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />
      <button
        onClick={() => setActivity(0)}
        className={`relative z-10 flex-1 font-bold py-2 rounded-full whitespace-nowrap m-1 sm:m-2 w-full sm:w-32 ${
          activity === 0 ? "text-black" : "text-white"
        }`}
      >
        Beat Saber
      </button>
      <button
        onClick={() => setActivity(1)}
        className={`relative z-10 flex-1 font-bold py-2 rounded-full whitespace-nowrap m-1 sm:m-2 w-full sm:w-32 ${
          activity === 1 ? "text-black" : "text-white"
        }`}
      >
        Break and Build
      </button>
      <button
        onClick={() => setActivity(2)}
        className={`relative z-10 flex-1 font-bold py-2 rounded-full whitespace-nowrap m-1 sm:m-2 w-full sm:w-32 ${
          activity === 2 ? "text-black" : "text-white"
        }`}
      >
        Escape Room
      </button>
      <button
        onClick={() => setActivity(3)}
        className={`relative z-10 flex-1 font-bold py-2 rounded-full whitespace-nowrap m-1 sm:m-2 w-full sm:w-32 ${
          activity === 3 ? "text-black" : "text-white"
        }`}
      >
        Gran Turismo 7
      </button>
      <button
        onClick={() => setActivity(4)}
        className={`relative z-10 flex-1 font-bold py-2 rounded-full whitespace-nowrap m-1 sm:m-2 w-full sm:w-32 ${
          activity === 4 ? "text-black" : "text-white"
        }`}
      >
        Puzzle Tracer
      </button>
      <button
        onClick={() => setActivity(5)}
        className={`relative z-10 flex-1 font-bold py-2 rounded-full whitespace-nowrap m-1 sm:m-2 w-full sm:w-32 ${
          activity === 5 ? "text-black" : "text-white"
        }`}
      >
        Step Mania
      </button>
    </div>
  );
}