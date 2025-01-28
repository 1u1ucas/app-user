import { motion } from "framer-motion";

type BoardButtonProps = {
  activity: number;
  setActivity: (value: number) => void;
};

export default function LeaderBoardButton({ activity, setActivity }: BoardButtonProps) {
  return (
    <div className="relative flex background rounded-full h-fit w-fit gap-12">
      {/* Effet de slide */}
      <motion.div
        className="absolute bg-[#00C8C8] rounded-full h-full w-1/5"
        animate={{ x: `${activity * 100}%` }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />
      <button
        onClick={() => setActivity(0)}
        className={`relative z-10 flex-1 font-bold py-2 rounded-full whitespace-nowrap m-2 w-32 ${
          activity === 0 ? "text-black" : "text-white"
        }`}
      >
        Beat Saber
      </button>
      <button
        onClick={() => setActivity(1)}
        className={`relative z-10 flex-1 self-center font-bold py-2 rounded-full m-2 w-32 ${
          activity === 1 ? "text-black" : "text-white"
        }`}
      >
        Break and Build
      </button>
      <button
        onClick={() => setActivity(2)}
        className={`relative z-10 flex-1 self-center font-bold py-2 rounded-full m-2 w-32 ${
          activity === 2 ? "text-black" : "text-white"
        }`}
      >
        Escape Room
      </button>
      <button
        onClick={() => setActivity(3)}
        className={`relative z-10 flex-1 self-center font-bold py-2 rounded-full m-2 w-32 ${
          activity === 3 ? "text-black" : "text-white"
        }`}
      >
        Gran Turismo 7
      </button>
      <button
        onClick={() => setActivity(4)}
        className={`relative z-10 flex-1 self-center font-bold py-2 rounded-full m-2 w-32 ${
          activity === 4 ? "text-black" : "text-white"
        }`}
      >
        Puzzle Tracer
      </button>
    </div>
  );
}